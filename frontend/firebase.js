import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chat-app-6ab95.firebaseapp.com",
  projectId: "chat-app-6ab95",
  storageBucket: "chat-app-6ab95.appspot.com",
  messagingSenderId: "39774078956",
  appId: "1:39774078956:web:f6f09233cea6c4124de2c9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export async function sendImages(images, directory) {
  const uploadPromises = []
  const imagesArr = []

  images.forEach((img) => {
    const image = {
      name: img.name,
      id: crypto.randomUUID(),
      url: null
    }

    const storageRef = ref(storage, `images/${directory}/${image.name}`);

    const promise = uploadBytes(storageRef, img)
      .then((snapshot) => getDownloadURL(snapshot.ref)
        .then(downloadURL => {
          image.url = downloadURL
          imagesArr.push(image)
        })
        .catch(err => {
          console.log('Error uploading images: ', err.message)
          throw err
        })
      );
    uploadPromises.push(promise)
  });

  try {
    await Promise.all(uploadPromises)
    return imagesArr
  } catch (err) {
    console.log('Error uploading images: ', err.message)
    throw err
  }
}

export async function sendFiles(files, directory) {
  const uploadPromises = []
  const filesArr = []

  files.forEach(f => {
    const file = {
      name: f.name,
    }

    const storageRef = ref(storage, `files/${directory}/${file.name}`)

    const promise = uploadBytes(storageRef, f)
      .then((snapshot) => getDownloadURL(snapshot.ref)
        .then(downloadURL => {
          file.url = downloadURL
          filesArr.push(file)
        })
      )
      .catch(err => {
        console.log('Error uploading files: ', err.message)
        throw err
      })

    uploadPromises.push(promise)
  })

  try {
    await Promise.all(uploadPromises)
    return filesArr
  } catch (err) {
    console.log('Error uploading files: ', err.message)
    throw err
  }

}

export async function deleteImages(images, directory) {
  const deletePromises = []

  images.forEach(img => {
    const imageRef = ref(storage, `images/${directory}/${img.name}`)

    const promise = deleteObject(imageRef)
      .then(() => console.log('image deleted'))
      .catch(err => console.log(err.message))

    deletePromises.push(promise)
  })

  try {
    await Promise.all(deletePromises)
  } catch (err) {
    console.log('Error deleting images')
    throw err
  }
}

export async function deleteFiles(files, directory){
  const deletePromises = []

  files.forEach(file => {
    const fileRef = ref(storage, `files/${directory}/${file.name}`)

    const promise = deleteObject(fileRef)
      .then(() => console.log('file deleted'))
      .catch(err => console.log(err.message))

      deletePromises.push(promise)
  })

  try{
    await Promise.all(deletePromises)
  }catch(err){
    console.log('Error deleting files')
    throw err
  }
}