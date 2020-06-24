// ライブラリクラス
class Library{
    constructor(){
        this._library = [...libraryBase];   // libraryBaseをコピー
    }

    // 山札をシャッフルするメソッド
    shufful(){
        this._library.sort((a, b) => Math.random() - 0.5);
    }

    // 山札からカードを取り出すメソッド
    draw(num){
        return this._deck.splice(0, num);
    }
}

// サイドボードクラス
class SideBord{
    constructor(){
        this._sidebord = [...sideBoardBase];    // sideBoardBaseをコピー
    }

    // サイドボードから手札に加えるメソッド
    putIn2Hand(){
        return 0;
    }
}
