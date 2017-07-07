var Hero = new Character("The Hero", 5, 3, 20,"hero");
var Troglodyte = new Character("Troglodyte", 3, 2, 30,"enemy");
var DireRat = new Character("Dire Rat", 1, 15, 20,"enemy");
var DireRat2 = new Character("Dire Rat", 1.5, 15, 20,"enemy");
var Ogre = new Character("Ogre", 9, 1, 60, "enemy");
var Sorcerer = new Character("Sorcerer", 6, 4, 20, "enemy");
var avatarX = 233;
var avatarY = 176;
var messageCount = 0;
var fogTop = 170;
var fogBottom = 20;
var fogLeft = 230;
var fogRight = 20;
var fightChance = Math.random();
var canMove = true;
var TreasureChest = new Location(
  "Treasure Chest",
 "A wooden chest. It's locked, but no wood can withstand your blade.",
 "treasure",
 "V",
 15.75 + 19.75 * Math.floor(Math.random() * 25),
 3.5 + 11.5 * Math.floor(Math.random() * 25));
 var TreasureChest2 = jQuery.extend({}, TreasureChest);
var locations = [TreasureChest, TreasureChest2];
var itemList = [];
var HeroShield = new Item("the shield", null, null, 20, false, "defend");
var MasterSword = new Item("the master sword", 25, 17, 30, false, null);
var IronHelm = new Item("iron helm", null, -1, 10, true, null);
var katana = new Item("katana", 1, 1, null, true, null);
var ritDagger = new Item("ritual dagger", -2, 2, 5, true, null);
var thornArmor = new Item("armor of thorns", 1, -1, 5, true, null);
var protected = false;
var ready = true;
var shielded;
//var hit;
var startOver;
var enemyAttack;
var globalEnemies = [Troglodyte, DireRat, DireRat2, Sorcerer, Ogre];
var messageArray = [];
window.addEventListener("keydown", move, false);
combat(Hero, globalEnemies);


//----------------------------------------------------------------
//                      HELPER FUNCTIONS
//----------------------------------------------------------------

function Character(name, strength, dexterity, vitality,objid) {
  this.name = name;
  this.strength = strength;
  this.dexterity = dexterity;
  this.vitality = vitality;
  this.ogVit = vitality;
  this.objid = objid;
}

function Item(name, strength, dexterity, vitality, toList, objid){
  this.name = name;
  this.strength = strength;
  this.dexterity = dexterity;
  this.vitality = vitality;
  this.ogVit = vitality;
  this.toList = toList;
  this.objid = objid;
  this.list = function() {if(this.toList == true){itemList.push(this)}}
  this.list();
}
function Location(name, message, objid, symbol, xCoord, yCoord){
  this.name = name;
  this.message = message;
  this.objid = objid;
  this.symbol = symbol;
  this.xCoord = xCoord;
  this.yCoord = yCoord;
}
// function Dex(Character){
//   return Math.pow(Math.random(), 1 / (Character.dexterity / 3));
// }
function move(e) {
if(canMove == true){
  fightChance = Math.random();
  if (e.keyCode == "87" && avatarY > 3.5) { //up; bound = 3.5
      avatarY -= 11.5;
      if((avatarY - fogTop) < 40){
      fogTop -= 20;
      fogBottom +=20;
    }
  }
  else if(e.keyCode == "83" && avatarY < 360){ //down; bound = 360
      avatarY += 11.5;
      if(fogTop + fogBottom - avatarY < 40){
      fogBottom += 20;
    }
  }
  else if(e.keyCode == "65" && avatarX > 15.75){ //left; bound = 15.75
      avatarX -= 19.75
      if(avatarX - fogLeft < 40){
      fogLeft -= 20;
      fogRight +=20;
    }
  }
  else if(e.keyCode == "68" && avatarX < 489.75){ //right; bound = 430.5
      avatarX += 19.75;
      if(fogLeft + fogRight - avatarX < 40){
      fogRight += 20;
    }
  }
  else if(e.keyCode == "66"){
    console.log("dev tools activated");
    buildMap(locations);
    equip(Hero, MasterSword);
  }
  $(".fog").css({"top": fogTop + "px", "padding-bottom": fogBottom + "px", "left": fogLeft + "px", "padding-right": fogRight + "px"});
  $("#avatar").css({"top": avatarY + "px", "left": avatarX + "px"});

  }
  if(fightChance > 0.95){
    $("#text-module").show();
    canMove = false;
  }
  else {
    canMove = true;
  }
  for(var b = 0; b < locations.length; b++){
    if(avatarX == locations[b].xCoord && avatarY == locations[b].yCoord){
      $("#text-module").show();
      $("#enter").hide();
      $("#open").show();
      print("message", locations[b].message);
      openChest(true);
    }
  }
}

function Damage(source_character, target_character){
  hit = Math.floor(Math.random() * source_character.strength + source_character.strength);
  target_character.vitality -= hit;
  document.getElementById(source_character.objid).innerHTML = source_character.vitality;
  document.getElementById(target_character.objid).innerHTML = target_character.vitality /*+ target_character.name */;
  document.getElementById("hero").innerHTML = Hero.vitality;
  document.getElementById("defend").innerHTML = "Shield: " + HeroShield.vitality;//TODO
  return hit;
}

function Shield(){//TODO fix during recursion
  Hero.vitality += 2;
  document.getElementById("hero").innerHTML = Hero.vitality;
  protected = true;
}

function readyUp(){
  ready = true;
  return ready;
}
function openChest(stage){
  $("#open").click(function(){

    if(stage){
    var chestContent = Math.floor(Math.random() * itemList.length);
    print("item", itemList[chestContent]);
    $("#equip").show();
    $("#equip").click(function(){
      equip(Hero, itemList[chestContent]);
      $("#equip").hide();
    })
  }
    else{
    $("#equip").hide();
    $("#open").hide();
    $("#enter").show();
    $("#text-module").hide();
    print("lastMessage", 3);}
    stage = !stage
  });

}

function print(messageType, message){
  if(messageType == "damageDealt"){
  document.getElementById("textBox").innerHTML = "You strike for " + message + " damage!"
  messageArray.push("You strike for " + message + " damage!")
}
  else if(messageType == "lastMessage"){
    document.getElementById("textBox").innerHTML = messageArray[messageCount - message];
    messageArray.push(messageArray[messageCount - message])
  }
  else if(messageType == "item"){
    var itemMessage = "The chest contains: " + message.name + "<br>"
    for(attribute in message){
      if(typeof message[attribute] == "number"){
        itemMessage += attribute + ": +" + message[attribute] + "<br>";
      }
    }
    document.getElementById("textBox").innerHTML = itemMessage;

  }
else{
  document.getElementById("textBox").innerHTML = message;
  messageArray.push(message);
}
messageCount++
console.log(messageArray.toString());
}

function buildMap(array) {
  var worldContents = "";
  var a;
  for(a = 0; a < array.length; a++){
    if(array[a-1] !== undefined && array[a].xCoord == array[a-1].xCoord){
      array[a].xCoord = 15.75 + 19.75 * Math.floor(Math.random() * 25);
    }
    if(array[a-1] !== undefined && array[a].yCoord == array[a-1].yCoord){
      array[a].yCoord = 3.5 + 11.5 * Math.floor(Math.random() * 25);
    }
    worldContents += "<div id='" + array[a].objid + "' style='top:" + array[a].yCoord + "px; left:" + array[a].xCoord + "px; position: absolute;'>" + array[a].symbol + "</div>";
  }
  document.getElementById("worldContent").innerHTML = worldContents;
}

function equip(target, equipment){
  console.log(target.name + " equipped " + equipment.name);
  var attribute;
  for(attribute in equipment){
    if(typeof equipment[attribute] == "number"){
      target[attribute] += equipment[attribute];
    }
  }
}

function combat(hero, enemyListArg){ //take in enemy list
// for(enemy_index = 0; enemy_index < enemyListArg.length; enemy_index++){
  window.onload = function(){
  combat_helper(hero, enemyListArg, 0);
  buildMap(locations);
};

}


function combat_helper(hero, enemyList, idx){ //TODO GLOBAL VARIABLES
  Hero.vitality = Hero.ogVit;
  HeroShield.vitality = HeroShield.ogVit;
  if(Hero.vitality <= 0){
    return;
  }
    print("enemy-message", "A fearsome " + enemyList[idx].name + " emerges from the shadows!")
    document.getElementById("enter").onclick = function() {
      $("#text-module").animate({
        top: '350px',
        left: '20px'
      }, 500);
      $("#combat-module").show(500);
      $("#enter").hide();
      $("#worldMap").hide();
    enemyAttack = setInterval(function() {
      print("combat start", "The enemy strikes!");
      if(protected == true){
        Damage(enemyList[idx], HeroShield)
      }
      else{
        Damage(enemyList[idx], Hero)
      }
      if(Hero.vitality <= 0){
        print("lul","You died!"); $("#combat-module").hide(1000);
      }
      if(HeroShield.vitality <= 0){
        window.clearInterval(shielded);
        protected = false;
        //jquery animation:
          $("#defendSlider").hide('fast');
      }
    }, 10000 / enemyList[idx].dexterity);
  }

    document.getElementById("hero").innerHTML = Hero.vitality;
    document.getElementById("enemy").innerHTML = enemyList[idx].vitality;
    document.getElementById("defend").innerHTML = "Shield: " + HeroShield.vitality;

    document.getElementById("attack").onclick = function() {
      if(ready){
      ready = false;
      window.setTimeout(readyUp, 10000 / Hero.dexterity);
      hitprint=Damage(Hero, enemyList[idx]);
      print("damageDealt", hitprint);
//jquery animations:
      $("#attackSlider").show();
      $("#attackSlider").animate({
        width: '0px'
      }, 10000 / Hero.dexterity, function() {
        $("#attackSlider").hide();
      $("#attackSlider").animate({
        width: '87px'
      }, 1);
    });
  }};

    if(protected == false && HeroShield.vitality > 0){
    document.getElementById("defend").onclick = function() {
      shielded = setInterval(function() {Shield()}, 4000);

    }}

    // var enemyAttack = setInterval(function() {print("combat start", "The enemy strikes!"); if(protected == true){Damage(enemyList[idx], HeroShield)} else{Damage(enemyList[idx], Hero)}}, 10000 / enemyList[idx].dexterity);
    window.onclick = function(){
      if(protected == true || HeroShield.vitality <= 0){
        window.clearInterval(shielded);
        protected = false;
        //jquery animation:
          $("#defendSlider").hide('fast');
      }
      if(enemyList[idx].vitality <= 0){
        enemyList[idx].vitality = 0;
        window.clearInterval(enemyAttack);
        $("#combat-module").hide(1000);
        $("#text-module").animate({
          top: "100px",
          left: "20px"
        }, 1000);
        print("message", "You've defeated the beast!");
        if (idx < enemyList.length){
          idx++;
          document.getElementById("enter").innerHTML = "––>";
          $("#enter").show();
          document.getElementById("enter").onclick = function(){
          canMove = true;
            // $("#combat-module").hide(500);
            // $("#text-module").animate({
            //   top: "100px",
            //   left: "20px"
            // }, 500).hide();
            $("#text-module").hide();
            $("#worldMap").show();
            document.getElementById("enter").innerHTML = "Engage";
            combat_helper(hero, enemyList, idx);
          }

        } //success
        else{
          print("message", "You've done it! You've cleared the dungeon!");
        }
      };
    };
    //jquery animation:
    $("#defend").click(function(){
      $("#defendSlider").show(4000);
      })

}
