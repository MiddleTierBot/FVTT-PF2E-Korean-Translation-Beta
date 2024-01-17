Hooks.on('init', () => {

    if(typeof Babele !== 'undefined') {
        Babele.get().register({
            module: 'pf2e-ko',
            lang: 'ko',
            dir: 'compendium'
        });
    }

    // Заплатка для исправления работы babele с библиотеками из модулей (актуальна для babele 2.5.2)
    // Исправляет https://gitlab.com/riccisi/foundryvtt-babele/-/issues/86
    libWrapper.register('pf2e-ko', 'CONFIG.DatabaseBackend._getDocuments', async function (wrapped, ...args) {
        const result = await wrapped(...args);
        if(!game.babele || !game.babele.initialized) {
            return result;
        }

        const documentClass = args[0], query = args[1].query, options = args[1].options, pack = args[1].pack, user = args[2];
        if(!pack || !result || !game.babele.isTranslated(pack)) {
            return result;
        }

        if(options.index) {
            return game.babele.translateIndex(result, pack);
        } else {
            return result.map(data => {
                return new documentClass(game.babele.translate(pack, data.toObject()), {pack});
            });
        }
    }, 'WRAPPER');
});
