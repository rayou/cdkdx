import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { Context } from '../context';
import { shell } from '../shell';

export class PackageCommand extends Command<Context> {
  @Command.Path('package')
  async execute(): Promise<number> {

    if (this.context.private) {
      this.context.stdout.write(
        '⚠ No packaging for private modules.\n\n'
      );
      return 0;
    }

    const outdir = 'dist';

    if (this.context.isJsii) {
      const command = [require.resolve('jsii-pacmak/bin/jsii-pacmak')];
      await shell(command);
    } else {
       const command = ['npm', 'pack'];
       const tarball = (await shell(command)).trim();
       const target = path.join(outdir, 'js');
       await fs.remove(target);
       await fs.mkdirp(target);
       await fs.move(tarball, path.join(target, path.basename(tarball)));
    }

    this.context.stdout.write(
      `✅ Construct ${this.context.name} packed.\n\n`
    );

    return 0;
  }
}