import inquirer from 'inquirer';
import { execa } from 'execa';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';

const ROOT_DIR = process.cwd();

async function run() {
  console.log(chalk.bold.cyan('\n🚀 Bem-vindo à Project Machine do Core-Base!\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Qual o nome do novo projeto? (kebab-case)',
      default: 'my-new-project',
      validate: (input) => /^[a-z0-9-]+$/.test(input) || 'Use apenas letras minúsculas, números e hifens.',
    },
    {
      type: 'input',
      name: 'orgScope',
      message: 'Qual o escopo da organização? (ex: @my-org)',
      default: '@my-project',
      validate: (input) => /^@[a-z0-9-]+$/.test(input) || 'O escopo deve começar com @ e usar kebab-case.',
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (ans) => `Confirmar a criação do projeto ${chalk.green(ans.projectName)} com o escopo ${chalk.green(ans.orgScope)}?`,
      default: true,
    },
  ]);

  if (!answers.confirm) {
    console.log(chalk.yellow('\nOperação cancelada pelo usuário.\n'));
    return;
  }

  try {
    // 1. Atualizar package.json files
    console.log(chalk.blue('\n📦 Atualizando pacotes...'));
    const packageFiles = await globby(['package.json', '**/package.json'], {
      ignore: ['**/node_modules/**'],
    });

    for (const file of packageFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const pkg = JSON.parse(content);
      
      const oldName = pkg.name;
      let newName = pkg.name;

      if (file === 'package.json') {
        newName = `${answers.projectName}-monorepo`;
      } else if (file.startsWith('packages/')) {
        const packageName = path.basename(path.dirname(file));
        newName = `${answers.orgScope}/${packageName}`;
      } else if (file.startsWith('apps/')) {
        const appName = path.basename(path.dirname(file));
        newName = `${answers.projectName}-${appName}`;
      }

      if (oldName !== newName) {
        pkg.name = newName;
        // Update dependencies/peerDependencies/devDependencies if they refer to @core scope
        const updateDeps = (deps: any) => {
          if (!deps) return;
          for (const dep of Object.keys(deps)) {
            if (dep.startsWith('@core/')) {
              const newDep = dep.replace('@core/', `${answers.orgScope}/`);
              deps[newDep] = deps[dep];
              delete deps[dep];
            }
          }
        };

        updateDeps(pkg.dependencies);
        updateDeps(pkg.devDependencies);
        updateDeps(pkg.peerDependencies);

        await fs.writeFile(file, JSON.stringify(pkg, null, 2) + '\n');
        console.log(`   ✅ ${file}: ${chalk.dim(oldName)} -> ${chalk.bold(newName)}`);
      }
    }

    // 2. Configurar .env
    console.log(chalk.blue('\n🔧 Configurando ambiente...'));
    try {
      await fs.copyFile('.env.example', '.env');
      console.log('   ✅ .env criado a partir de .env.example');
    } catch (e) {
      console.log(chalk.yellow('   ⚠️ .env.example não encontrado. Pulando...'));
    }

    // 3. Limpar CHANGELOG.md
    console.log(chalk.blue('\n📝 Limpando CHANGELOG.md...'));
    await fs.writeFile('CHANGELOG.md', `# Changelog - ${answers.projectName}\n\nTodas as mudanças notáveis neste projeto serão documentadas neste arquivo.\n`);
    console.log('   ✅ CHANGELOG.md resetado');

    // 4. Resetar README.md
    console.log(chalk.blue('\n📖 Resetando README.md...'));
    const readmeTemplate = `# ${answers.projectName}\n\nProjeto inicializado a partir do Core Base Template.\n\n## Desenvolvimento\n\n1. \`pnpm install\`\n2. \`docker compose up -d\`\n3. \`pnpm run dev\`\n`;
    await fs.writeFile('README.md', readmeTemplate);
    console.log('   ✅ README.md resetado');

    // 5. Resetar GIT
    console.log(chalk.blue('\n🧹 Reiniciando histórico do Git...'));
    await execa('rm', ['-rf', '.git'], { shell: true });
    await execa('git', ['init']);
    await execa('git', ['add', '.']);
    await execa('git', ['commit', '-m', 'chore: initial commit from core-base']);
    console.log('   ✅ Git reiniciado');

    console.log(chalk.bold.green(`\n✨ Projeto ${answers.projectName} inicializado com sucesso!\n`));
  } catch (error) {
    console.error(chalk.red('\n❌ Erro durante a inicialização:'), error);
    process.exit(1);
  }
}

run();
