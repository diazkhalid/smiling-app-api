/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable global-require */
/* eslint-disable space-before-blocks */
const fs = require('fs');

const getImgByIdHandler = (request, h) => {
  const { idS, id } = request.params;
  const idStory = parseInt(idS);
  const data = fs.readFileSync('DATA-IMG.json', 'utf8');
  const jsonData = JSON.parse(data);
  const imageData = jsonData.picture.find((story) => story.idStory === idStory);
  const image = imageData.fileImg.find((img) => img.id === id);

  if (!image){
    return h.response('Gambar tidak ditemukan').code(404);
  }

  const { fileName } = image;
  return h.file(fileName);
};

const getThumbByIdHandler = (request, h) => {
  try {
    const imageId = parseInt(request.params.id);
    const data = fs.readFileSync('DATA-IMG.json', 'utf8');
    const jsonData = JSON.parse(data);
    const thumbnailImg = jsonData.thumbnail.find((thumb) => thumb.id === imageId);

    if (thumbnailImg) {
      const { fileName } = thumbnailImg;
      return h.file(fileName);
    }
    return h.response('Data not found').code(404);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return h.response('Error').code(500);
  }
};

const getAllBooks = (request, h) => {
  try {
    const jsonData = fs.readFileSync('DATA.json', 'utf8');
    const data = JSON.parse(jsonData);
    return h.response(data).type('application/json');
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return h.response('Error').code(500);
  }
};

const getBookByIdHandler = (request, h) => {
  try {
    const { id } = request.params;
    const data = fs.readFileSync('DATA.json', 'utf8');
    const jsonData = JSON.parse(data);
    const story = jsonData.stories.find((story) => story.id === id);

    if (story) {
      return h.response(story).code(200);
    }
    return h.response('Data not found').code(404);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return h.response('Error').code(500);
  }
};

const searchStoryHandler = async (request, h) => {
  const { title } = request.query;
  const data = fs.readFileSync('DATA.json', 'utf8');
  const jsonData = JSON.parse(data);
  const result = jsonData.stories.filter((story) => story.title.toLowerCase().includes(title));

  if (result.length > 0) {
    return h.response(result).code(200);
  }
  return h.response('Data not found').code(404);
};

module.exports = {
  getAllBooks, getBookByIdHandler, getImgByIdHandler, getThumbByIdHandler, searchStoryHandler,
};
