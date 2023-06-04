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
const { nanoid } = require('nanoid');
const path = require('path');
const DateHelper = require('./date-helper');

const getImgByIdHandler = (request, h) => {
  const { idS, id } = request.params;
  const idStory = parseInt(idS);
  const data = fs.readFileSync('data/DATA-IMG.json', 'utf8');
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
    const data = fs.readFileSync('data/DATA-IMG.json', 'utf8');
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
    const jsonData = fs.readFileSync('data/DATA.json', 'utf8');
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
    const data = fs.readFileSync('data/DATA.json', 'utf8');
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
  const data = fs.readFileSync('data/DATA.json', 'utf8');
  const jsonData = JSON.parse(data);
  const result = jsonData.stories.filter((story) => story.title.toLowerCase().includes(title));

  if (result.length > 0) {
    return h.response(result).code(200);
  }
  return h.response('Data not found').code(404);
};

const addReview = async (request, h) => {
  const { id, name, review } = request.payload;
  const DATE = new Date().toISOString();
  const inDate = new Date(DATE);
  const year = inDate.getFullYear();
  const month = String(DateHelper.monthNameChecker(inDate.getMonth() + 1)); // Menambahkan '0' jika panjang string kurang dari 2
  const day = String(inDate.getDate());
  const date = `${day} ${month} ${year}`;
  const idReview = nanoid(8);
  const newReview = {
    idReview, name, review, date,
  };
  const data = fs.readFileSync('data/DATA.json', 'utf8');
  const jsonData = JSON.parse(data);
  const story = jsonData.stories.find((story) => story.id === id);
  const reviewStory = story.review;
  reviewStory.push(newReview);

  const isSuccess = story.review.filter((review) => review.idReview === idReview).length > 0;
  if (isSuccess) {
    const jsonOuput = JSON.stringify(jsonData);
    const outputPath = path.join(__dirname, '../data', 'DATA.json');
    fs.writeFile(outputPath, jsonOuput, (err) => {
      if (err) throw err;
    });
    const response = h.response({
      status: 'success',
      message: 'Review berhasil ditambahkan',
      data: {
        reviewId: idReview,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Review gagal ditambahkan',
  });
  response.code(500);
  return response;
};

module.exports = {
  getAllBooks, getBookByIdHandler, getImgByIdHandler, getThumbByIdHandler, searchStoryHandler, addReview,
};
