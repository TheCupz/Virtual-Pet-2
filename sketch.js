//Create variables here
var dog, happyDog, dogImg, happyDogImg;
var milk, milkImg;
var foodS, foodStock;
var foodObj;
var fedTime, lastFed; 
var database;

function preload(){
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  milkImg = loadImage("images/Milk.png");
}
 
function setup() {
  database = firebase.database();
	createCanvas(1000, 400);
  dog = createSprite(800,250,150,150);
  dog.addImage(dogImg);
  foodObj  = new Food() 
  dog.scale = 0.15;
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);


  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {  
  background(46,139,87);
  foodObj.display();
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDogImg);
  }
  fedTime = database.ref('FeedTime')
  fedTime.on("value", function(data){
    lastFed = data.val();
  })
  fill("white");
  textSize(15);
  if(lastFed >= 12){
    text("Last fed: " + lastFed%12+"pm", 350, 100);
  }
  else if(lastFed === 0){
    text("Last fed: 12am", 350, 100)
  }
  else{
    text("Last fed: " + lastFed+"am", 350, 100)
  }
  drawSprites(); 
  fill("white");
  stroke("Black");
  text("Food Remaining: " + foodS, 170, 100);
  textSize(13);
  text("Note: Press the Up arrow key to feed Drago Milk!", 130, 20);
  //add styles here

}

function readStock(data){
  foodS=data.val();
  console.log("reading" + foodS);
  foodObj.updateFoodStock(foodS)
}

function writeStock(x){
  if(x<=0){
    x = 0
  }
  else{
    x = x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++
  console.log(foodS)
  database.ref('/').update({
    Food:foodS
  })
}
