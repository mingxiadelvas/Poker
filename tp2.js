//TP remis le 18 avril 2018
//Ming-Xia Delvas et Jean-François Baril
//Programme servant à jouer au poker shuffle sur un fureteur web

var jeu;//tableau contenant 25 cartes choisies aléatoirement
var carteChoisie;//a la valeur 25 quand on clique sur la pile et 26 quand aucune carte n'est choisit
var grille;//contenu de la grille de jeu, index [25] = carte sur la pile

//Fonction permettant d'afficher la forme de la page web désirée
var init = function () {
  var core = "<table><tr><td><button onclick=init();>Nouvelle\npartie</button>"
           + "</td><td></td><td id='pile'onclick=clic('pile');>"
          +"<img src='cards/back.svg'></td><td></td></tr></table><table>";
  for (var i=0; i<6 ;i++){//boucle qui permet de faire les 5 lignes
      core += "<tr>";
    for(var j=0; j<6; j++){//boucle qui permet de faire les 5 colonnes
        if(j<5 && i<5){
          core += "<td id=" +(j+i*5)+" onclick=(clic(" +(j+i*5)+"))>"
               + "<img src='cards/empty.svg'></td>";
        }
        if(i==5){
          core += (j < 5) ? "<td id= C" +j+"></td>"
                          : "<td id= Total>0</td></tr></table>";
        }
        if(j==5){//si on a 5 colonnes on ferme la rangée
          core += "<td id= L"+ i+"></td></tr>";
        }
    }
  }
  document.getElementById("b").innerHTML = core ;
  jeu = brasserCartes();
  grille = Array(26).fill(52);
};
//Fonction qui retourne l'objet correspondant avec l'identifiant
var elem = function(id){
  return document.getElementById(id);
};

//Fonction qui retourne la carte identifiée de couleur transparente
var transparent = function(id){
  return elem(id).style.backgroundColor = "transparent";
};
//Fonction qui retourne la carte identifiée de couleur lime
var lime = function(id){
  return elem(id).style.backgroundColor = "lime";
};

//Fonction qui permet d'afficher les images des cartes du jeu ainsi que la 
//couleur lime ou transparent de la carte sélectionnée
var clic = function(id){
  
  if(id == 'pile'){
    if(elem(id).innerHTML == '<img src="cards/back.svg">'){
      grille[25] = jeu.pop();//grille égale au dernier élément du tableau jeu
      elem('pile').innerHTML = imageCarte(grille[25]);//load l'image associée à la valeur de grille
      lime('pile');
      if(carteChoisie < 25){//cas ou clique sur la même carte sa valeur sera égale à son identifiant
        transparent(carteChoisie);
      }
      carteChoisie = 25;//choisit une carte du paquet et carteChoisie est égale à 25 
    } else if(elem(id).style.backgroundColor == "lime" && 
        elem(id).innerHTML == 'img src="cards/empty.svg">'){
        transparent(id);
    } else if(elem(id).style.backgroundColor == "transparent"){//rend la carte du paquet couleur lime si elle était transparente
        if(carteChoisie < 25){
          transparent(carteChoisie);
        }
        lime(id);
        carteChoisie = 25;
    } else {
        transparent(id);
        carteChoisie = 26;//carteChoisie prend la valeur 26 quand clique sur une carte vide
      }
  } else { 
      if(carteChoisie==25 && elem(id).innerHTML=='<img src="cards/empty.svg">'){ 
          transparent('pile');
          elem(id).innerHTML = imageCarte(grille[25]);
          grille[id] = grille[25];
          grille[25] = 52; //la valeur 52 équivaut une carte vide ou endos
          elem('pile').innerHTML = '<img src="cards/back.svg">';
          carteChoisie = 26;
          compterPoints(grille);
        if(jeu.length == 0){//affiche un message quand il ne reste plus de carte dans le paquet
          elem('pile').innerHTML = '<img src="cards/empty.svg">';
          setTimeout(function(){ 
            alert("Votre pointage final est " + elem("Total").innerHTML);},500);
          setTimeout(function(){ init();},600);
        } 
    } else if(carteChoisie == id){
        transparent(id);
        carteChoisie = 26;
    } else if(carteChoisie == 26 &&
      elem(id).innerHTML != '<img src="cards/empty.svg">'){ 
        lime(id);
        carteChoisie = id;
    } else if(carteChoisie != id && carteChoisie < 25){
        var temp = grille[id];
        elem(id).innerHTML = imageCarte(grille[carteChoisie]);
        elem(carteChoisie).innerHTML = imageCarte(temp);
        transparent(carteChoisie);
        grille[id] = grille[carteChoisie];
        grille[carteChoisie] = temp;
        carteChoisie = 26;
        compterPoints(grille);
      }
  }
};
//Fonction affichant l'élément balisée de l'image associé à  la valeur de la carte
var imageCarte = function(carte){
  if(carte == 52){
    return "<img src=cards/empty.svg>";
  }
  var couleur = "";
  var chiffre = "";
  switch (carte & 3){//associe la valeur résultante de l'encodage binaire à la couleur de la carte
    case 0: couleur = "H";break;
    case 1: couleur = "S";break;
    case 2: couleur = "D";break;
    case 3: couleur = "C";break;
  }
  switch (carte >> 2){//trouve la valeur numérique correspondant à la carte
    case 0: chiffre = "A";break;
    case 1: chiffre = "2";break;
    case 2: chiffre = "3";break;
    case 3: chiffre = "4";break;
    case 4: chiffre = "5";break;
    case 5: chiffre = "6";break;
    case 6: chiffre = "7";break;
    case 7: chiffre = "8";break;
    case 8: chiffre = "9";break;
    case 9: chiffre = "10";break;
    case 10: chiffre = "J";break;
    case 11: chiffre = "Q";break;
    case 12: chiffre = "K";break;
  }
  return "<img src=cards/" + chiffre + couleur + ".svg>";
};

//Fonction choisit aléatoirement un paquet de 25 cartes parmi les 52 cartes
var brasserCartes = function(){
  var paquet = Array(52).fill(0).map(function (x,i){ return i;});
  var jeu = [];
  for(var i=0; i<25; i++){
    var aleat = Math.floor(Math.random()*(51-i));
    jeu.push(paquet[aleat]);
    paquet.splice([aleat],1);//enlève la valeur aleat du tableau de paquet
  }
  return jeu;
};
//Fonction qui affiche le pointage associé à  chaque ligne et colonne du jeu
var compterPoints = function(tableau){
  var col = compter(ordonnerListe(colonnes(tableau)));
  var lig = compter(ordonnerListe(lignes(tableau)));
  var total = 0;//la valeur total de tous les pointages
  for(var i=0; i<5; i++){
    if(col[i] == 0){//si il n'y aucun point on affiche rien
      elem("C"+i).innerHTML = "";
    }
    if(lig[i] == 0){
      elem("L"+i).innerHTML = "";
    }
    if(lig[i] != 0){//affiche le pointage associé à la ligne correspondant
      elem("L"+i).innerHTML = lig[i];
      total += lig[i];
    }
    if(col[i] != 0){
      elem("C"+i).innerHTML = col[i];
      total += col[i];
    }
  }
  elem("Total").innerHTML = total;
};
//Fonction retourne une matrice2D contenant les valeurs des cartes associées
//aux rangées du jeu
var lignes = function(tab){
  var matrice = [];
  for(var k=0; k<5; k++){
    matrice.push(tab.slice(k*5,(k+1)*5));
  }
  return matrice;
};
//Fonction qui retourne une matrice2D contenant les valeurs des cartes associées
//aux colonnes du jeu
var colonnes = function(tab){
  var matrice = []; 
  for(var i=0; i<5; i++){//permet d'avoir dans le tableau 5 tableaux vides
      matrice.push([]);
    for(var j=0; j<5; j++){
      matrice[i].push(tab[i+j*5]);
    }
  }
  return matrice;
};
//Fonction qui trie en odre croissant les valeurs numériques pour chaque tableau
var ordonnerListe = function(tab){
  var listeOrdonnee = [];
    for(var i=0; i<tab.length; i++){
      listeOrdonnee.push(tab[i].sort(function(x,y){return x-y;}));     
    }
    return listeOrdonnee; 
};
//Fonction servant à calculer le pointage associé aux différentes mains de poker
var compter = function(tab){

  var points = Array(5).fill(0);//valeurs initiales du pointage selon leur position dans tableau
  for(var i=0; i<5; i++){
    var paire = 0;
    var suite = 0;
    var flush = 0;

  while(tab[i][tab[i].length-1] == 52 && tab[i].length > 1){
        tab[i].pop();//enlève les 52 en trop de chaque tableau dans grille
    }
    for(var j=0; j<tab[i].length-1; j++){
      //vérifie si on a une suite ou un flush quand la colonne ou la rangée contient 5 cartes
      if(tab[i].length == 5){
        if((tab[i][j] & 3) == (tab[i][j+1] & 3)){
          flush++;
        }
        if((tab[i][j+1]>>2)-(tab[i][j]>>2) == 1){
          suite++;
        }
      }
      if(suite == 3 && tab[i][0] >> 2 == 0 && tab[i][4] >> 2 == 12){
        suite ++;
      }
      //boucle permettant de calculer pour chaque tableau les différentes combinaisons de paires
      for(var k=j+1; k<tab[i].length; k++){
        if(tab[i][j] >> 2 == tab[i][k] >> 2){
        paire ++;
        }
        if(flush == 4 && suite == 4){
          //si la première condition est vraie c'est un quinte flush royale sinon un quinte flush
          (tab[i][4]>>2 == 12 && tab[i][0]>>2 == 0) ? points[i]=100 : points[i]=75;
        } else if(flush == 4){
          points[i] = 20;
        } else if(suite == 4){
          points[i] = 15;
        } else {
          switch(paire){//calcule la valeur correspondant aux nombres de paires et retourne à la 3ieme boucle
              case 1 : points[i] = 2;break;
              case 2 : points[i] = 5;break;
              case 3 : points[i] = 10;break;
              case 4 : points[i] = 25;break;
              case 6 : points[i] = 50; break;
          }
        }  
      }
    }
  }
  return points;
};
//Fonction qui vérifie les tests unitaires
var testJeu = function(){
  console.assert(imageCarte((52) == "<img src=cards/empty.svg>"));
  console.assert(imageCarte((5) == "<img src=cards/2S.svg>"));
  console.assert(imageCarte((30) == "<img src=cards/7D5.svg>"));
  console.assert(imageCarte((0) == "<img src=cards/AH.svg>"));
  console.assert(imageCarte((51) == "<img src=cards/KC.svg>"));
};
