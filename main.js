let deckListFile = document.getElementById('decklist');
let handsDiv = document.getElementById('hands');
let libraryDiv = document.getElementById('library');
let libraryImgDiv = document.getElementById('library-img');
let sideboardDiv = document.getElementById('sidebord');
let library = [];
let libraryBase = [];
let field = []
let fieldDiv = document.getElementById('field');
let lands = []
let landsDiv = document.getElementById('lands');
let libraryBottom = []
let libraryBottomDiv = document.getElementById('library-bottom');
let sideboard = [];
let sideboardBase = [];
let standardCards = [];
let stack = []
let stackDiv = document.getElementById('stack');
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
    cl.setAttribute('onclick', "reloadArea()");
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
        const cardList = createCardList(arr[i]);
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
    reloadArea();   // 最新の状態にする
    library.shufful();
    addCard(library._library, libraryDiv);  // ライブラリーの描画し直し
}

// リセットボタンが押されたときに新しくゲームを開始したときの状態にする
document.getElementById('reset-button').onclick = function(){
    reloadArea();   // 念のため最新の状態にする
    gameStart();
    mulliganNum = 0;    // マリガン数の初期化
}

// マリガンを行うかの確認とマリガンを行う関数
function mulligan(){
    let elm = document.getElementById("mulliganMessage");
    let result = window.confirm('マリガンしますか？');
    if(result){
        mulliganNum += 1;   // マリガン数をカウント
        elm.textContent = "マリガン回数 : " + mulliganNum;
        gameStart();
        console.log('マリガンしました');
    }
    else if(mulliganNum > 0){
        console.log(elm)
        elm.textContent = "手札から" + mulliganNum + "枚選んでデッキボトムにおいてください。"
        
    }
    else{
        console.log('キープしました');
    }
}


// 確率を計算するボタンが押されたときに呼び出され、確率をテーブルに追加する関数
document.getElementById('probability').onclick = function(){
    reloadArea();   // 最新の状態を読み込む
    inputCardName = document.getElementById('input-card-name').value;
    inputDrawNum = document.getElementById('input-draw-num').value;
    arr = clcProbability(inputCardName, inputDrawNum);
    const proTab = document.getElementById("probability-table");
    let cap = document.createElement("caption");
    cap.textContent = "ライブラリーから" + arr.length + "枚引いたときに" + inputCardName + "を引く確率";
    proTab.appendChild(cap);
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    th1.textContent = "枚";
    th2.textContent = "確率";
    tr.appendChild(th1);
    tr.appendChild(th2);
    proTab.appendChild(tr);
    
    for(let i=0; i < arr.length; i++){
        let tr = document.createElement("tr");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");
        th1.textContent = i + 1;
        th2.textContent = arr[i];
        tr.appendChild(th1);
        tr.appendChild(th2);
        console.log(tr);
        proTab.appendChild(tr);
    }
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




// name(カードの名前),dorawNum(ドローする枚数)を受け取り、nameを引く確率を求める関数
function clcProbability(name, dorawNum){
    proArr = [] // 確率の配列
    let count = 0;  // デッキの中にnameが存在するか調べる
    let deckLength = library._library.length;   // デッキの枚数
    for(let i=0; i<deckLength; i++){
        if(library._library[i]===name){
            count += 1;
        }
    }
    
    // デッキにnameが存在しないとき
    if(count === 0){
        for(let i=1; i<=dorawNum;i++){
            proArr.push([0]);
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
            proArr.push([(targetCon * otherCon) / allCon]);
        }
    }
    return proArr;
}

// デッキの1番下にカードを置く関数
function putDeckBottom(card){
    library._library.push(card);
    addCard(library._library, libraryDiv);  // ライブラリの描画し直し
}

// 複数のリストの境界を越え、ドラッグ＆ドロップで並べ替えをする関数
$( function() {
    $( '.jquery-ui-sortable' ) . sortable( {
        connectWith: '.jquery-ui-sortable'
    } );
    $( '.jquery-ui-sortable' ) . disableSelection();
} );

// 各領域を再読み込みする関数
function reloadArea(){
    // フィールド
    field = readArea(fieldDiv, field);

    // 土地
    lands = readArea(landsDiv, lands)

    // 手札
    hands = readArea(handsDiv, hands);

    // ライブラリーボトム
    // ここにカードが存在する場合、ライブラリーへ移動させる
    libraryBottom = readArea(libraryBottomDiv, library);
    while(libraryBottom.length > 0){
        const cardList = createCardList(libraryBottom.pop());
        libraryDiv.appendChild(cardList);
        // libraryBottomDiv.removeChild(libraryBottomDiv.lastChild);
    }
    addCard(libraryBottom, libraryBottomDiv);

    // ライブラリー
    library._library = readArea(libraryDiv, library._library);

    // 墓地
    graveyard = readArea(graveyardDiv, graveyard);

    // 追放
    exile = readArea(exileDiv, exile);

    // サイドボード
    sideboard = readArea(sideboardDiv, sidebord);

}

// 指定された領域のデータを読み込んで領域の変数に格納する関数
function readArea(elm, area){
    area = [];
    for(let i=1; i<elm.children.length; i++){
        area.push(elm.children[i].textContent);
    }
    return area;
}

// 開始時のライブラリ、手札、サイドボードを定義
function gameStart(){
    library = new Library();
    console.log(library);
    hands = library.draw(7);
    sideboard = new SideBord();
    field = [];
    lands = [];
    graveyard = [];
    stack = [];
    exile = [];
    libraryBottom = []
    addCard(hands, handsDiv);
    addCard(library._library, libraryDiv);
    addCard(sideboard._sidebord, sideboardDiv);
    addCard(graveyard, graveyardDiv);
    addCard(exile, exileDiv)
    addCard(stack, stackDiv);
    addCard(lands, landsDiv);
    addCard(field, fieldDiv);
    document.getElementById('my-life').value = 20;
    document.getElementById('enemy-life').value = 20;
    document.getElementById('input-card-name').value = "";
    document.getElementById('input-draw-num').value = "";
}
