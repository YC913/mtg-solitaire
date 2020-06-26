let deckListFile = document.getElementById('decklist');
let handsDiv = document.getElementById('hands');
let libraryDiv = document.getElementById('library');
let libraryImgDiv = document.getElementById('library-img');
let sideboardDiv = document.getElementById('sidebord');
let library = [];
let libraryBase = [];
let sideboard = [];
let sideboardBase = [];
let standardCards = [];
let hands = [];
let graveyard = []; // 墓地のカード
let graveyardDiv = document.getElementById('graveyard');
let exile = []; // 追放領域のカード
let exileDiv = document.getElementById('exile');
const section = document.querySelector('section');
let mulliganNum = 0;    // マリガンした回数
let cardData = []    // カードの画像のリンクなど、カードの情報が入っているオブジェクトの配列
cardData = [
    {
        name : "ドビンの拒否権",
        img_path : "https://mtg-jp.com//img_sys/cardImages/WAR/462440/cardimage.png"
    }
];

// // jsonでデータ取得
// let path = 'StandardCards.json';
// $.getJSON(path, function(json){
//     standardCards = json;
//     // デッキリストの情報を取得
    
//     // standardCardsに情報を格納
// });
// let newlines = standardCards.filter(function(item, index){
//     if(item.printing == ["INV", "PRNA", "RNA"]){
//         // console.log(item);
//         return true;
//     }
// });
// console.log(newlines);

// Magic: The Gathering SDKを使ってカード情報を取得
// set, numberで絞り込む
// 画像は日本語のものを使用する
// const mtg = require('mtgsdk')

// // mtg.card.find(3)
// // .then(result => {
// //     console.log(result.card.name) // "Black Lotus"
// // })

// // mtg.set.find('AER')
// // .then(result => {
// //     console.log(result.set.name) // "Aether Revolt"
// // })
// mtg.card.where({set : 'RNA'}).then(cards => {
//     console.log(cards[0].foreignNames[4]);
// });

// mtg.card.where({set : 'RNA',number : '151'}).then(cards => {
//     console.log(cards);
// });


// デッキリストを読み込んでライブラリとサイドボードを作成する
deckListFile.addEventListener('change', function(evt){
    let file = evt.target.files;

    let reader = new FileReader();  // FileReaderの作成
    reader.readAsText(file[0]); // テキスト形式で読み込む

    reader.onload = function(ev){
        
        let deckList = reader.result.split(/[\r\n]+/);  // 改行で配列にしたもの

        // ライブラリの素の作成
        libraryBase = shapeList(deckList.slice(deckList.indexOf('デッキ')+1, deckList.indexOf('サイドボード')));

        // サイドボードの素の作成
        sideboardBase = shapeList(deckList.slice(deckList.indexOf('サイドボード') + 1));

        // ゲーム開始の処理
        // library = new Library();
        // hands = library.draw(7);
        // sideboard = new SideBord();

        // addCard(hands, handsDiv);
        // addCard(library._library, libraryDiv);
        // addCard(sideboard._sidebord, sideboardDiv);
        gameStart();
    }
    
    
},false);


// カードを表す要素を作成する関数
const createCardElement = (card_name) => {
    const col = document.createElement('div');
    col.classList.add('col-1');
    
    const elem = document.createElement('div');
    elem.classList.add('card');
    elem.classList.add('card-block');
    
    const img = document.createElement('img');
    img.classList.add("card-img");

    let targetCard = cardData.filter(function(item, index){
        if(item.name === card_name){
            img.src = item.img_path;
        } return true;
    });
    
    // console.log(targetCard);
    if(img.src === ""){
        img.src = "card-back-side.jpg";
    }

    img.alt = card_name;
    elem.appendChild(img);

    const cio = document.createElement('div');
    cio.classList.add('card-img-overlay')
    const cardLabel = document.createElement('div');
    cardLabel.classList.add('card-title');
    cardLabel.innerText = card_name;
    cio.appendChild(cardLabel);
    elem.appendChild(cio);
    col.appendChild(elem);
  
    return col;
  };

// カード要素を追加する関数
function addCard(arr, container){
    container.innerHTML = '';    // 子要素の初期化
    let myDiv = document.createElement('div');
    for(let i=0; i<arr.length; i++){
        const cardElem = createCardElement(arr[i][0]);
        container.appendChild(cardElem);
    }
}

// const createCardElement = (card) => {
//     const elem = document.createElement('div');
//     elem.classList.add('card');

//     // 「アダントの先兵」のような表示を作る
//     const cardLabel = document.createElement('div');
//     cardLabel.innerText = `${card.suit || ''}${card.label}`;
//     elem.appendChild(cardLabel);

//     // isHoldフラグがあれば、「HOLD」表示を追加し、
//     // 要素にholdクラスを追加する
//     if(card.isHold) {
//         const holdIndicator = document.createElement('div');
//         holdIndicator.innerText = 'HOLD';
//         elem.appendChild(holdIndicator);
//         elem.classList.add('hold');
//     }

//     return elem;
// };

// ライブラリーが押されたときにライブラリからドローする関数
libraryImgDiv.onclick = function(){
    hands.push(library.draw(1)[0]); // 手札にカードを1枚追加
    addCard(hands, handsDiv);   // // 手札の描画し直し
    addCard(library._library, libraryDiv);
}


// シャッフルボタンが押されたときにライブラリをシャッフルする関数
document.getElementById('shufful-button').onclick = function(){
    library.shufful();
    addCard(library._library, libraryDiv);  // ライブラリーの描画し直し
}

// リセットボタンが押されたときに新しくゲームを開始したときの状態にする
document.getElementById('reset-button').onclick = function(){
    gameStart();
    mulliganNum = 0;    // マリガン数の初期化
}

// 右クリックされたときの処理
window.onload = function(){
    const cardsNodeList = document.getElementsByClassName("card");
    for(let i=0; i < cardsNodeList; i++){
        cardsNodeList[i].addEventListener('contextmenu',function (e){
            //マウスの位置をstyleへ設定（左上の開始位置を指定）
            document.getElementById('contextmenu').style.left=e.pageX+"px";
            document.getElementById('contextmenu').style.top=e.pageY+"px";
            //メニューをblockで表示させる
            document.getElementById('contextmenu').style.display="block";
        });
    }
    document.body.addEventListener('click',function (e){
        //メニューをnoneで非表示にさせる
        document.getElementById('contextmenu').style.display="none";
    });
}
function menu1(){
open( "https://www.google.com/", "_blank" ) ;
}
function menu2(){
open( "https://www.yahoo.co.jp/", "_blank" ) ;
}
function menu3(){
open( "https://www.amazon.co.jp/", "_blank" ) ;
}


// nCkのコンビネーションの計算をする関数
function conbination(n, k){
    if(n < k){
        return 0;
    }
    else if(n===k){
        return 1;
    }
    else{
        // コンビネーションの特性を活かして計算量を減らす
        if((n - k) < k){
            k = n - k;
        }
        let numerator = 1;  // 分子
        let denominator = 1; //分母
        for(let i=k; i > 0; i--){
            numerator *= (n - i + 1);
            denominator *= i;
        }
        
        return numerator / denominator;
    }
}

// name(カードの名前),dorawNum(ドローする枚数)を受け取り、nameを引く確率を求める
function clcProbability(name, dorawNum){
    proArr = [] // 確率の配列
    let count = 0;  // デッキの中にnameが存在するか調べる
    let deckLength = library._library.length;   // デッキの枚数
    for(let i=0; i<deckLength; i++){
        if(library._library[i][0]===name){
            count += 1;
        }
    }
    
    // デッキにnameが存在しないとき
    if(count === 0){
        for(let i=1; i<=dorawNum;i++){
            proArr.push([i,0]);
        }
    }
    else{
        for(let i=1; i<=dorawNum;i++){
            if(i > count){
                break;
            }
            let targetCon = conbination(count, i);
            let otherCon = conbination(conbination(deckLength - count, dorawNum - i));
            let allCon = conbination(deckLength,i);
            console.log((targetCon * otherCon) / allCon)
            proArr.push([i, (targetCon * otherCon) / allCon]);
        }
    }
    return proArr;
    
    // 1枚〜drawNumまでの各ドローにおける確率を求める
    
}


// マリガンを行うかの確認とマリガンを行う関数
function mulligan(){
    let result = window.confirm('マリガンしますか？');
    if(result){
        mulliganNum += 1;   // マリガン数をカウント
        gameStart();
        console.log('マリガンしました');
    }
    else if(mulliganNum > 0){
        // 何枚デッキの下に戻すか選ぶ

        mulliganNum = 0;    // マリガン数の初期化
    }
    else{
        console.log('キープしました');
    }
}


// デッキの1番上にカードを置く関数
function putDeckTop(card){
    library._library.unshift(card);
    addCard(library._library, libraryDiv);  // ライブラリの描画し直し
}

// デッキの1番下にカードを置く関数
function putDeckBottom(card){
    library._library.push(card);
    addCard(library._library, libraryDiv);  // ライブラリの描画し直し
}

// 墓地にカードを置く関数
function putGraveyard(card){
    graveyard.push(card);
    addCard(graveyard, graveyardDiv);
}

// 追放領域にカードを置く関数
function putExile(card){
    exile.push(card);
    addCard(exile, exileDiv);
}

// 開始時のライブラリ、手札、サイドボードを定義
function gameStart(){
    library = new Library();
    console.log(library);
    hands = library.draw(7);
    sideboard = new SideBord();
    graveyard = []
    exile = []
    addCard(hands, handsDiv);
    addCard(library._library, libraryDiv);
    addCard(sideboard._sidebord, sideboardDiv);
    addCard(graveyard, graveyardDiv)
    addCard(exile, exileDiv)
}
