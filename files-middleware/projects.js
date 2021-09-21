const path = require('path')
const { Storage } = require('@google-cloud/storage')
const serviceKey = path.join(__dirname, '../config/binadari-302619-e127cb412642.json')

const gc = new Storage({
  keyFilename: serviceKey,
  projectId: 'binadari-302619',
})

const bucket = gc.bucket('binadari_projects');

exports.deleteDirFromCloud = async (folderName) =>  {
  try {
    let files = await bucket.getFiles();
    let dirFiles = files[0].filter(f => f.name.includes(`${folderName}/`));
    dirFiles.forEach(async file => {
      await file.delete();
    });
  } catch (e) {
    throw e;
  }
};

exports.deleteFileFromCloud = async (filename) =>  {
  try {
    let files = await bucket.getFiles();
    let deleteFile;
    for (let file of files[0]) {
      if (filename.includes(file.name)) {
        deleteFile = file;
        break;
      }
    }
    await deleteFile.delete();
  } catch (e) {
    throw e;
  }
};

exports.uploadToCloud = (file, folderName) => new Promise((resolve, reject) => {
  const {originalname, buffer} = file;
  const blob = bucket.file(`${folderName}/${originalname.replace(/ /g, "_")}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true
  });
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    resolve(publicUrl);
  }).on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  }).end(buffer)
})

