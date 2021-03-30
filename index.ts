import * as moduleAlias from 'module-alias';

moduleAlias.addAliases({
    '@app': `${__dirname}/src/app`,
    '@model': `${__dirname}/src/model`,
    '@service': `${__dirname}/src/service`,
    '@repository': `${__dirname}/src/repository`,
    '@controller': `${__dirname}/src/controller`,
    '@util': `${__dirname}/src/util`,
});

import { run } from '@app/index';

const port = Number(process.env.APP_PORT);

(async () => {
    await run(port);
})();
