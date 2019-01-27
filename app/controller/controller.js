import Sound from '../../lib/rdo/sound.js';
import Config from '../model/config.js';
import Highscore from '../model/highscore.js';
import Options from '../model/options.js';
import Blockdestroyer from '../model/blockdestroyer.js';
import View from '../view/view.js';

class Controller {
	constructor() {
		this.sound = new Sound();

		this.config = new Config();
		this.config.load(this.init.bind(this));
	}

	init() {
		this.highscore = new Highscore();
		this.options = new Options(this.config);
		this.blockdestroyer = new Blockdestroyer();

		this.view = new View(this.config, {
			'options': this.options,
			'highscore': this.highscore,
			'blockdestroyer': this.blockdestroyer
		});

		// navigation
		this.view.addCallback('navToGameAction', this.navToGameAction.bind(this));
		this.view.addCallback('navToHighscoreAction', this.navToHighscoreAction.bind(this));
		this.view.addCallback('navToMenuAction', this.navToMenuAction.bind(this));
		this.view.addCallback('navToOptionsAction', this.navToOptionsAction.bind(this));
		// highscore
		this.view.addCallback('saveNameToHighscoreAction', this.saveNameToHighscoreAction.bind(this));
		this.view.addCallback('applyNameToHighscoreAction', this.applyNameToHighscoreAction.bind(this));
		this.view.addCallback('resetHighscoreAction', this.resetHighscoreAction.bind(this));
		// options
		this.view.addCallback('setMusicAction', this.setMusicAction.bind(this));
		this.view.addCallback('nextLanguageAction', this.nextLanguageAction.bind(this));
		this.view.addCallback('previousLanguageAction', this.previousLanguageAction.bind(this));
		// game
		this.view.addCallback('removeBlockAction', this.removeBlockAction.bind(this));
	}

	navToGameAction() {
		this.blockdestroyer.newGame();
		this.view.showGameView();
	}

	navToHighscoreAction() {
		this.view.showHighscoreView();
	}

	navToMenuAction() {
		this.view.showMenuView();
	}

	navToOptionsAction() {
		this.view.showOptionsView();
	}

	saveNameToHighscoreAction() {
		this.highscore.save();
	}

	applyNameToHighscoreAction(args) {
		this.highscore.applyName(args.content);
	}

	resetHighscoreAction() {
		this.highscore.reset();
	}

	setMusicAction() {
		this.options.music = !this.options.music;

		if (this.options.music) {
			this.sound.play('resources/music/track_01.mp3');
		} else {
			this.sound.stop();
		}
	}

	nextLanguageAction() {
		this.options.setNextLanguage();

		this.config.loadLanguageFile(
			this.options.language,
			this.view.updateTextures.bind(this.view)
		);
	}

	previousLanguageAction() {
		this.options.setPreviousLanguage();

		this.config.loadLanguageFile(
			this.options.language,
			this.view.updateTextures.bind(this.view)
		);
	}

	removeBlockAction(args) {
		if (this.blockdestroyer.canMove()) {
			this.blockdestroyer.triggerBlock(parseInt(args.x), parseInt(args.y));

			if (!this.blockdestroyer.canMove()) {
				this.highscore.initNewEntry(this.blockdestroyer.level, this.blockdestroyer.points);

				this.navToHighscoreAction();
			}
		}
	}
}

export default Controller;