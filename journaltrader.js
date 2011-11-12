//SETUP <DONE>
var rexCash, rexBank, rexDay, rexInterestRate, rexWage, rexProduct, rexAssets, rexAverage;

function rexProductMaker(name,price){
this.name=name;
this.price=price;
this.owned=0;
this.available=1000;
}

var rexProducts = [new rexProductMaker("AERE",5), new rexProductMaker("AEPA",15), new rexProductMaker("AJAR",20), new rexProductMaker("JORH",25), new rexProductMaker("APV",40), new rexProductMaker("TAJA",50), new rexProductMaker("SJTG",90), new rexProductMaker("GEOR",240), new rexProductMaker("APEL",270), new rexProductMaker("ECOR",360), new rexProductMaker("ECPA",400), new rexProductMaker("NZG",550)]

//REFRESH DISPLAY <DONE>
function rexShowStats(){
	document.getElementById("playerCash").innerHTML=rexCash;
	document.getElementById("playerBank").innerHTML=rexBank;
	rexProduct = 0
	for (var i=0; i<rexProducts.length; i++) 
	{
		var newAsset = rexProducts[i].price*rexProducts[i].owned;
		rexProduct = rexProduct + newAsset;
	};
	document.getElementById("playerProduct").innerHTML=rexProduct;
	rexAssets = rexCash + rexBank + rexProduct;	
	document.getElementById("playerAssets").innerHTML=rexAssets;
	rexAverage = Math.round((rexAssets*1)/(rexDay*1));
	document.getElementById("playerAverage").innerHTML=rexAverage;
	document.getElementById("dayNumber").innerHTML=rexDay;	
	document.getElementById("daysLeft").innerHTML=60-(rexDay*1);
	document.getElementById("playerWage").innerHTML=rexWage;
	document.getElementById("playerInterest").innerHTML=rexInterestRate.toFixed(2)+"%";
	for (var i=0; i<rexProducts.length; i++) 
	{
		document.getElementById(rexProducts[i].name+"PriceField").innerHTML = rexProducts[i].price;
		document.getElementById(rexProducts[i].name+"AvailableField").innerHTML = rexProducts[i].available;
		document.getElementById(rexProducts[i].name+"OwnedField").innerHTML = rexProducts[i].owned;
	}

}

//BANKING <DONE>
function rexInterestRateUpdate(){
	rexInterestRate = (rexInterestRate + (rexInterestRate * (0.05-(Math.random()/10))));
}

function rexDeposit(){
	depositAmount=document.getElementById("depositField").value;
	if (depositAmount <= rexCash){
		rexBank=rexBank*1+depositAmount*1;
		rexCash=rexCash*1-depositAmount*1;
		rexShowStats();
	}
	else {
		alert("Not enough cash to deposit")
	}
	document.getElementById("withdrawField").value="";
	document.getElementById("depositField").value="";
}

function rexWithdraw(){
	withdrawAmount=document.getElementById("withdrawField").value;
	if (withdrawAmount <= rexBank){
	rexBank=rexBank*1-withdrawAmount*1;
	rexCash=rexCash*1+withdrawAmount*1;
	rexShowStats();
	}
	else {
	alert("Not enough in the account to withdraw")
	}
	document.getElementById("withdrawField").value="";
	document.getElementById("depositField").value="";
}
	
function rexBankMax(){
	document.getElementById("depositField").value=rexCash*1;
	document.getElementById("withdrawField").value=rexBank*1;
}

//BUY AND SELL <DONE>
function rexProductMax(passedProduct){
	for (var i=0; i<rexProducts.length; i++) 
	{
		if (passedProduct == rexProducts[i].name)
		{
			canAfford = Math.floor(rexCash/rexProducts[i].price);
			canBuy = rexProducts[i].available;
			document.getElementById(rexProducts[i].name+"BuyField").value = Math.min(canAfford,canBuy);
			document.getElementById(rexProducts[i].name+"SellField").value = rexProducts[i].owned;
			canAfford = canBuy = 0;
		}
	}
}

function rexBuy(passedProduct){
//Set variables for amount of product to purchase and total cost
	var buyAmount = document.getElementById(passedProduct + "BuyField").value*1;
	var buyCost = buyAmount*(document.getElementById(passedProduct + "PriceField").innerHTML*1);
//Check cash
	if (rexCash < buyCost){
		alert("Not enough money, try a smaller amount");
		}
//Check product
	else if (passedProduct.available < buyAmount*1){
		alert("Not enough stock, try a smaller amount");
	}
//Deduct cash
	else {rexCash = rexCash - buyCost;
//Deduct available
		for (var i=0; i<rexProducts.length; i++) 
		{
			if (passedProduct == rexProducts[i].name){
				rexProducts[i].available = rexProducts[i].available*1 - buyAmount;
				}
		}
//Add owned
		for (var i=0; i<rexProducts.length; i++) 
		{
			if (passedProduct == rexProducts[i].name){
				rexProducts[i].owned = rexProducts[i].owned*1 + buyAmount;
			}
		}
	}
//Update display
	for (var i=0; i<rexProducts.length; i++) 
	{
	document.getElementById(rexProducts[i].name+"BuyField").value = "";
	document.getElementById(rexProducts[i].name+"SellField").value = "";
	}
	rexShowStats();
}

function rexSell(passedProduct){
//Set variables for amount of product to sell and total price
	var sellAmount = document.getElementById(passedProduct + "SellField").value*1;
	var sellPrice = sellAmount*(document.getElementById(passedProduct + "PriceField").innerHTML*1);
//Check owned
	for (var i=0; i<rexProducts.length; i++) 
	{
		if (passedProduct == rexProducts[i].name && (rexProducts[i].owned < sellAmount || rexProducts[i].owned < 1)){
			alert("Try only selling what you have");
			sellFail=1;
		}
	}
//Add cash
	if (sellFail != 1)
	{
		rexCash = rexCash + sellPrice;
//Add available
		for (var i=0; i<rexProducts.length; i++) 
		{
			if (passedProduct == rexProducts[i].name)
			{
			rexProducts[i].available = rexProducts[i].available*1 + sellAmount;
			}
		}
//Deduct owned
		for (var i=0; i<rexProducts.length; i++) 
		{
			if (passedProduct == rexProducts[i].name)
			{
				rexProducts[i].owned = rexProducts[i].owned*1 - sellAmount;
			}
		}
	}
//Update display
	var sellFail=0;
	for (var i=0; i<rexProducts.length; i++) 
	{
	document.getElementById(rexProducts[i].name+"BuyField").value = "";
	document.getElementById(rexProducts[i].name+"SellField").value = "";
	}
	rexShowStats();
}

//PRICE CHANGE <DONE>
function rexUpdatePrices(){
	for (var i=0; i<rexProducts.length; i++) 
	{
		rexProducts[i].price = Math.round(rexProducts[i].price + (rexProducts[i].price * (0.05-(Math.random()/10))));
	}
}

//GAME END <DONE>
function rexGameEnd(){
	var newGame = confirm("Game Over!" + '\n' + "You made $" + rexAssets + " in your 60 days." + '\n' + "Try again to beat that total?");
	if (newGame == 1){
	window.location.reload();
	}
}

//END DAY AND CLEAN <DONE>
function rexWork(){
	rexDay++;
	rexCash = rexCash + rexWage;
	rexBank=Math.round(rexBank*(1+(rexInterestRate/100)));
	rexUpdatePrices();
	rexInterestRateUpdate();
	rexShowStats();
	if (rexDay == 60){
	rexGameEnd();
	}
}

//SETUP NEW GAME <DONE>
function rexInitGame(){
	rexCash=250;
	rexDay=1;
	rexBank=750;
	rexWage=25;
	rexInterestRate=3.00;
	rexProduct = 0;
	for (var i=0; i<rexProducts.length; i++) 
	{
		rexProducts[i].owned = 0;
		rexProducts[i].available = 1000;
	}
	rexShowStats();
}