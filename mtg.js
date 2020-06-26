// ライブラリークラス
class Library{
    constructor(){
        this._library = [...libraryBase];   // libraryBaseをコピー
        this.shufful();
    }

    // 山札をシャッフルするメソッド
    shufful(){
        this._library.sort((a, b) => Math.random() - 0.5);
    }

    // 山札からカードを取り出すメソッド
    draw(num){
        return this._library.splice(0, num);
    }
}

// サイドボードクラス
class SideBord{
    constructor(){
        this._sidebord = [...sideboardBase];    // sideboardBaseをコピー
    }

    // サイドボードから手札に加えるメソッド
    putIn2Hand(){
        return 0;
    }
}

// カード枚数分だけカード要素を複製し、リストに保存する関数
function shapeList(defaultList){
    let cardList = []
    for(let i=0; i < defaultList.length; i++){
        let cardNum = Number(defaultList[i].split(' ')[0]);
        let cardData = defaultList[i].split(' ').slice(1,defaultList.length);
        for(let j=0; j < cardNum; j++){
            // カードを追加
            cardList.push(cardData[0]);
        }
    }
    return cardList;
}