fs.open(filepath, `wx+`, (err, fd) => {
  console.log(`30`);
  
  if (err) {
    console.log(`35 err fs.open: `, err.code);

    fs.stat(dir, err => {
      console.log(`40 fs.stat(dir)`);
      if (err) {
        console.log("60 Каталог не найден, создаём");

        fs.mkdir(dir, (err) => {
          if (err) throw err
          console.log(`70 Каталог создан`);
          ws = writeStream();
          ws.write(...body);
          console.log(`80 Файл создан`);
          res.end(...body); 
          return;
        });
      }
    });
      
    // switch (err.code) {
    //   case `EEXIST`: 
    //     console.log(`60 Такой файл уже существует EEXIST`);

    //     res.statusCode = 409;
    //     res.end(`Такой файл уже существует EEXIST`);
    //     return;
      
      // case `ENOENT`:
      //   console.log("60 Каталог не найден");

      //   fs.mkdir(dir, (err) => {
      //     if (err) throw err
      //     console.log(`70 Каталог создан`);

      //     ws = writeStream();
      //     ws.write(...body);
      //     console.log(`80 Файл создан`);
      //     res.end(...body);
      //     return;
      //   });

      // break;
  } else {
    console.log(`120 - write(...body)`);
    ws.write(...body);

    console.log('130 res.statusCode 200');
    res.statusCode = 200;
    res.end(...body);
  }
})