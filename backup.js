const path = require('path');
const archiver = require('archiver')
const fs = require('fs-extra')
const nodemailer = require('nodemailer');

// получения флага
function getValue(flag) {
  const index = process.argv.indexOf(flag)
  let arrFilter = []

  if(index > -1 && process.argv[index + 1]){

    for(let i = index ; i < process.argv.length; i++) {

      if(process.argv[i+1] && !process.argv[i+1].includes('-')){
        arrFilter.push(process.argv[i+1])
      }
     
    }
  }

  return arrFilter
    
}

const smtpTransport = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // true for 465, false for other ports 587
  auth: {
    user: "yourlogin",
    pass: "yourpassword"
  }
})

const  mailOptions = {
  from: 'yourlogin', 
  to: getValue('-m').join(','), 
  subject: 'Бекап вашего проекта',
  attachments: [
    {
      path:'./backup.zip'
    }
  ]
}

// архивация
function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
      archive
       .directory(source, false)
       .on('error', err => reject(err))
       .pipe(stream);

   	  stream.on('close', () => resolve());
   	  archive.finalize();
  	});
}



fs.readdir(__dirname, function (err, files) {

  if (err) return console.log('Unable to scan directory: ' + err);
      


  let filterFiles = files.filter(file => {
      return !getValue('-f').includes(file)
  })

  fs.mkdir('backup',() => {

    console.log('\nкопирование файлов...\n')

   	filterFiles.forEach(i => {
   		// если папка
   		if(fs.statSync(i).isDirectory()) {

   			fs.mkdirSync(`backup/${i}`)
   			fs.copySync(i, `backup/${i}`)
   		}
   		// если файл
   		if(fs.statSync(i).isFile()) {
   			fs.createReadStream(i).pipe(fs.createWriteStream(`backup/${i}`))
   		}
   	}) 

   	console.log('создание архива...\n')

   	zipDirectory(`${__dirname}/backup`, `${__dirname}/backup.zip`)

   	.then(() => {

      console.log('отправка архива...\n')

      smtpTransport.sendMail(mailOptions, (error, info) => {

        if (error) return console.log(error);

        console.log('Архив отправлен')

        // удаление
        fs.removeSync('backup')

        fs.removeSync('backup.zip')

      })
      
     
   	})

   	
   })
	
});




