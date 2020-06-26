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
        gameStart();
    }
},false);


// カードの名前をもつリストを作成
const createCardList = (card_name) => {
    const cl = document.createElement('li');
    cl.classList.add('ui-state-default');
    cl.classList.add('card-name');
    cl.textContent = card_name;
    return cl;
};


// カード要素を追加する関数
function addCard(arr, container){
    // 最初のリスト（ラベルになっている）を除いて全てのカード部分だけ初期化する
    while(container.children.length > 1){
        container.removeChild(container.lastChild);
    }

    // container.innerHTML = '';    // 子要素の初期化
    for(let i=0; i<arr.length; i++){
        const cardList = createCardList(arr[i][0]);
        container.appendChild(cardList);
    }
}


// ライブラリーが押されたときにライブラリからドローする関数
function draw(){
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

// マリガンを行うかの確認とマリガンを行う関数
window.onload = function(){
    console.log(document.getElementById('mulligan-button'));
    document.getElementById('mulligan-button').onclick = function(){
        let result = window.confirm('マリガンしますか？');
        if(result){
            mulliganNum += 1;   // マリガン数をカウント
            gameStart();
            console.log('マリガンしました');
        }
        else if(mulliganNum > 0){
            // マリガンボタンを押せなくする
            
            // mulliganNum枚だけデッキボトムに戻してと表示する
            
        }
        else{
            // マリガンボタンを押せなくする
            const button = document.getElementById('mulligan');
            console.log(button);
            button.disabled = true;
            console.log('キープしました');
        }
    }
};

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

// 複数のリストの境界を越え、ドラッグ＆ドロップで並べ替えをする関数
$( function() {
    $( '.jquery-ui-sortable' ) . sortable( {
        connectWith: '.jquery-ui-sortable'
    } );
    $( '.jquery-ui-sortable' ) . disableSelection();
} );

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
