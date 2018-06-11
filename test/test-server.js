'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {BlogPost} = require('./models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


function seedBlogData() {
  console.info('seeding blog data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBlogData());
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
}

function generateAuthorName() {
  const authors = [
    'Cat Perez', 'Sebastian Bastidas', 'Ning Liang', 'Jeff Kriege', 'Janelle Fontana'];
  return authors[Math.floor(Math.random() * authors.length)];
}

function generateTitle() {
  const titles = ['Coding While Founding', 'Dev Turned Mentor', 'Ex-Twitter Employee Founds Successful Health Tech Startup', 'Designer Turns To Product', 'Millenial Rises in ACA Mission-Oriented Company'];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateContent() {
  const content = 
  [
  'Lorem ipsum dolor amet actually sustainable hell of, hoodie iPhone vape viral flannel bushwick sartorial fashion axe taxidermy pop-up heirloom. Letterpress slow-carb ethical jean shorts vexillologist. Keffiyeh selvage kitsch, lyft pop-up VHS man bun food truck. Cliche kitsch DIY, cold-pressed truffaut tilde mixtape. Cardigan semiotics occupy letterpress +1 pug. Wayfarers selvage whatever small batch chia stumptown.', 
  'Single-origin coffee flannel cred, plaid prism bushwick locavore vinyl man braid VHS taiyaki leggings enamel pin put a bird on it pitchfork. Pickled snackwave banh mi, hammock distillery YOLO coloring book whatever bespoke. Heirloom blog fanny pack, portland semiotics affogato biodiesel VHS raclette. Chia jean shorts brooklyn, shaman tacos offal church-key blog. Keffiyeh stumptown 8-bit plaid vegan man bun direct trade, pabst try-hard cornhole street art meh locavore shoreditch.', 
  'Normcore tumeric typewriter four dollar toast hashtag heirloom meggings occupy cardigan cornhole pickled pok pok taiyaki. XOXO tousled DIY migas crucifix. 8-bit tumblr lumbersexual vice vape af. Hammock hoodie green juice gluten-free.', 
  'Farm-to-table godard artisan viral activated charcoal intelligentsia jean shorts pok pok chambray dreamcatcher kinfolk craft beer bushwick. Irony 8-bit butcher lomo kickstarter. Tofu narwhal sustainable kombucha. Selvage gentrify forage pabst flexitarian neutra tofu DIY lo-fi squid. Plaid sartorial banh mi you probably have not heard of them, tofu quinoa street art fashion axe portland vegan gastropub ramps. Hexagon pickled kombucha literally ennui celiac fam man bun health goth etsy helvetica shabby chic jianbing raclette DIY.', 
  'PBR&B DIY roof party, knausgaard edison bulb glossier chartreuse waistcoat lyft tbh chillwave locavore actually ramps kogi. Tumeric 8-bit austin, cornhole whatever four loko mlkshk echo park flexitarian unicorn pabst. Master cleanse literally vape shabby chic, photo booth migas deep v fanny pack put a bird on it cliche listicle distillery tilde swag pinterest. Chartreuse la croix yr, typewriter man bun wolf bushwick locavore 3 wolf moon vaporware everyday carry celiac enamel pin gastropub franzen. Seitan tofu cronut artisan cliche wolf vexillologist blue bottle everyday carry cray williamsburg retro single-origin coffee mlkshk.'
  ];
  return titles[Math.floor(Math.random() * titles.length)];

function generateDate() {
  const publishDate = faker.date.past();
  const publishDate = publishDate[Math.floor(Math.random() * publishDate.length)];
  return {
    date: faker.date.past()
  };
}

function generateBlogData() {
  return {
    author: generateAuthorName(),
    title: generateTitle(),
    cuisine: generateCuisineType(),
    address: {
      building: faker.address.streetAddress(),
      street: faker.address.streetName(),
      zipcode: faker.address.zipCode()
    },
    grades: [generateGrade(), generateGrade(), generateGrade()]
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Blog API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

});

describe('GET endpoint', function() {

  it('should return all existing blog posts', function() {
    let res;
    return chai.request(app)
    .get('/blog-posts')
    .then(function(_res) {
      res = _res;
      expect(res).to.have.status(200);
      expect(res.body.BlogPost).to.have.lengthOf.at.least(1);
      return BlogPosts.count();
    })
    .then(function(count) {
      expect(res.body.BlogPosts).to.have.lengthOf(count);
    });
  });


  it('should return blog posts with right fields', function() {

    let resBlogPost;
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.BlogPosts).to.be.a('array');
        expect(res.body.BlogPosts).to.have.lengthOf.at.least(1);

          res.body.blogPosts.forEach(function(restaurant) {
            expect(blogPost).to.be.a('object');
            expect(blogPost).to.include.keys(
              'id', 'author', 'content', 'title', 'publishDate');
          });
          resBlogPost = res.body.blogPosts[0];
          return blogPost.findById(resBlogPost.id);
        })
        .then(function(blogPost) {

          expect(resBlogPost.id).to.equal(blogPost.id);
          expect(resBlogPost.author.name).to.equal(blogPost.author.name);
          expect(resBlogPost.title).to.equal(blogPost.title);
          expect(resBlogPost.content).to.equal(blogPost.content);
          expect(resBlogPost.publishDate).to.contain(blogPost.address.publishDate);
        });
    });
  });

describe('POST endpoint', function() {
  it('should add a new blog post', function() {

    const newPost = generateBlogData();

    return chai.request(app)
      .post('/blog-posts')
      .send(newBlogPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys(
          'id', 'author', 'title', 'content', 'publishDate');
          // cause Mongo should have created id on insertion
        expect(res.body.id).to.not.be.null;
        expect(res.body.author).to.equal(newBlogPost.author);
        expect(res.body.title).to.equal(newBlogPost.title);
        expect(res.body.content).to.equal(newBlogPost.content);
      })
      .then(function(BlogPost) {
        expect(BlogPost.author).to.equal(newBlogPost.author);
        expect(BlogPost.title).to.equal(newBlogPost.title);
        expect(BlogPost.content).to.equal(newBlogPost.content);
      });
    });
  });


 
  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        author: 'Fofofof Fofferson',
        title: 'Futuristic Fusion'
      };

      return BlogPost
        .findOne()
        .then(function(BlogPost) {
          updateData.id = BlogPost.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/blog-posts/${BlogPost.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return BlogPost.findById(updateData.id);
        })
        .then(function(BlogPost) {
          expect(BlogPost.author).to.equal(updateData.author);
          expect(BlogPost.title).to.equal(updateData.title);
        });
    });
  });



   it('should add a blog post on POST', function() {
    const newPost = {
      title: 'Lorem ip some',
      content: 'foo foo foo foo',
      author: 'Emma Goldman'
    };
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys(expectedKeys);
        expect(res.body.title).to.equal(newPost.title);
        expect(res.body.content).to.equal(newPost.content);
        expect(res.body.author).to.equal(newPost.author)
      });
  });


describe('DELETE endpoint', function() {
  it('delete a restaurant by id', function() {

    let BlogPost;

    return Restaurant
      .findOne()
      .then(function(_blogPosts) {
        BlogPost = _blogPosts;
        return chai.request(app).delete(`/blog-posts/${BlogPost.id}`);
      })
        .then(function(res) {
          expect(res).to.have.status(204);
          return BlogPost.findById(BlogPost.id);
        })
        .then(function(_restaurant) {
          expect(_blogPosts).to.be.null;
      });
    });
  });
});

