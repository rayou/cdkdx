import { Command } from 'clipanion';

import { Context } from '../context';

export class ReleaseCommand extends Command<Context> {
  @Command.Path(`release`)
  async execute() {

    return 0;
  }
}
