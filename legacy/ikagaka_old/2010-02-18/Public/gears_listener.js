

/*
 * The listener calls this script on the caller domain and checks whether there is a message in the caller message queue
 */

var wp       = google.gears.workerPool;
wp.allowCrossOrigin();
wp.onmessage = function(a, b, message) {
	
	// parse the hostname out of the messages's origin
	var origin = new String(message.origin);
	var parts  = origin.split("/");
	var domain = parts[2];
	parts      = domain.split(":"); // remove port
	domain     = parts[0];
	
	var recipient = domain;
	var channelId = message.text;

	// Create the table in case it is not there yet
	var db = google.gears.factory.create('beta.database');
	db.open('database-xssinterface');
	db.execute('create table if not exists XSSMessageQueue' +
           ' (id INTEGER PRIMARY KEY AUTOINCREMENT, recipient_domain TEXT, channel_id TEXT, message TEXT, insert_time INTEGER)');
	
	// delete (and thus ignore) old messages
	var maxAge = new Date().getTime() - 2000;
	db.execute('delete from XSSMessageQueue where insert_time < ?',[maxAge]);
	
	db.close();
	
	// Start looking for new messages
	var timer = google.gears.factory.create('beta.timer');
	timer.setInterval(function() { 
		// get a new db handle on each iteration
		var db = google.gears.factory.create('beta.database');
		db.open('database-xssinterface');
		
		db.execute("BEGIN TRANSACTION");
		
		// find new messages for meps 
		var rs = db.execute('select id, message from XSSMessageQueue where recipient_domain = ? and channel_id = ?', [recipient, channelId]);

		// there are new messages for the recipient
		while(rs.isValidRow()) {
			var id   = rs.field(0);
			var text = rs.field(1);
			
			// send the message to our creator
			wp.sendMessage(text, message.sender);
			db.execute("DELETE from XSSMessageQueue where id = ?", [id]); // unqueue message
			rs.next()
		}
		
		rs.close();
		
		db.execute("COMMIT")
		
		db.close();
	 }, 300);
}
