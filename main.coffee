do ->
	ikgk = new Ikagaka
	window.ikgk = ikgk
	miku = new Ikagaka.Named
	miku.shell = new Ikagaka.MMDShell
	miku.load ->
		miku.shell.load ->
			ikgk.addNamed("miku", miku)
			ikgk.named("miku").materialize()
			ikgk.named("miku").shell.command("\\i[kishimen]")