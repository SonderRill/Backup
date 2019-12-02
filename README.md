# Backup
Project backup to mail.

To work, you need installed node.js and the modules "archiver", "fs-extra", "nodemailer". Departure comes from Yandex mail. You must write your login@yandex.ru on line 31 and 37 and the password on 32

node backup (mandatory flag) -m (your mail your mail2) -will send your entire project to your mail and your mail2

node backup (mandatory flag) -m (your mail) -f (test test.js)-will send your entire project to your mail besides text and text.js

This send will not send to gmail due to archive blocking.
