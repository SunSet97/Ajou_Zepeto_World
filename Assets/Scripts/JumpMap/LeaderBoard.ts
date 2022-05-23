import { GameObject, Rect, Sprite, Texture, Texture2D, Time, Vector2 } from 'UnityEngine'
import { Image, Text } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRangeRankResponse, LeaderboardAPI, Rank, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard'
import { ZepetoWorldHelper } from 'ZEPETO.World'

export default class LeaderBoard extends ZepetoScriptBehaviour {

    // public buttonasdf : GameObject
    public profileImage : Image[]
    public medalImage : Image[]
    public medalText : Text[]
    public playerName : Text[]
    public score : Text[]
    public leaderBoardPanel : GameObject

    @Header("1, 2, 3위, 그 외 순서대로 넣으세요.")
    public medalSprites : Sprite[]
    public leaderBoardItemParent : GameObject
    public timerText : Text
    public resetRule : ResetRule

    // public btn : Button
    //public player : CharacterFloorDetector
    @Header("디버그용입니다~")
    public timer : float
    public isStart : bool
    
    public readonly leaderboardId : string
    Start(){
        // this.btn.onClick.AddListener(() =>{
        //     this.ShowRank()
        // })
        var itemCount = this.leaderBoardItemParent.transform.childCount
        this.leaderBoardPanel.SetActive(false)
        this.profileImage = new Array<Image>(itemCount)
        this.medalImage = new Array<Image>(itemCount)
        this.medalText = new Array<Text>(itemCount)
        this.playerName = new Array<Text>(itemCount)
        this.score = new Array<Text>(itemCount)
        // console.log(this._leaderBoards)
        // console.log(this._leaderBoards.Capacity)
        for(var i = 0; i < itemCount; i++){
            // console.log(1)
            this.medalImage[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(0).GetComponent<Image>()
            // console.log(2)
            this.medalText[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(0).GetChild(0).GetComponent<Text>()
            // console.log(3)
            this.profileImage[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(1).GetChild(0).GetComponent<Image>()
            // console.log(4)
            this.playerName[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(1).GetChild(1).GetComponent<Text>()
            // console.log(5)
            this.score[i] = this.leaderBoardItemParent.transform.GetChild(i).GetChild(1).GetChild(2).GetComponent<Text>()
            // console.log(6)
        }
    }
    GameStart(){
        if(!this.isStart){
            this.isStart = true
            this.timer = .0
            this.timerText.gameObject.SetActive(true)
        }
    }

    GameEnd(){
        if(this.isStart){
            //플레이어에 붙은 스크립트 삭제
            //GameObject.DestroyImmediate(this.player)
            LeaderboardAPI.SetScore(this.leaderboardId, this.timer, this.OnSetScoreResult, (error) => {console.log("에러 : " + error)})
            this.ShowRank()
            //LeaderboardAPI.GetRangeRank("", 1, 100, null, )
            this.timerText.gameObject.SetActive(false)
            this.timer = .0
            this.isStart = false
        }
    }

    public ShowRank(){
        LeaderboardAPI.GetRangeRank(this.leaderboardId, 1, 10000, this.resetRule, false, (response : GetRangeRankResponse) => {
            console.log("리더보드 불러오기 결과 : " + response.isSuccess)
            console.log("총 랭킹 카운트" + response.rankInfo.totalRankCount)
    
            for(var index = 0; index < response.rankInfo.rankList.length; index++){
                var rank = response.rankInfo.rankList[index]
                console.log("랭크 : " + " " + rank.name + " " + rank.score + " " + rank.rank + '\n' + rank.member)
            }
            
            // console.log("--------------------------")
            this.leaderBoardPanel.SetActive(true)
            var childCount = this.leaderBoardItemParent.transform.childCount
            
            var index = 0
            if(response.rankInfo.myRank.member != null){
                var myRank : Rank = response.rankInfo.myRank
                console.log("내 랭킹" + myRank.name + " " + myRank.score + " " + myRank.rank + '\n' + myRank.member)
                if(myRank.rank > 3){
                    this.medalText[index].text = myRank.rank.toString()
                    this.medalImage[index].sprite = this.medalSprites[3]
                }else{
                    this.medalImage[index].sprite = this.medalSprites[index]
                    this.medalText[index].text = ''
                }
                this.medalImage[index].enabled = true
                this.profileImage[index].enabled = true
                this.SetProfileImage(this.profileImage[index], myRank.member)
                this.playerName[index].text = myRank.name
                this.score[index].text = myRank.score.toString()
                index++
            }

            for(var rankIndex = 0; index < childCount; index++, rankIndex++){
            //     //보여주기
                if(index < response.rankInfo.rankList.length){
                    if(response.rankInfo.myRank.rank != null && index == response.rankInfo.myRank.rank - 1){
                        rankIndex++
                    }
                    var rank : Rank = response.rankInfo.rankList[rankIndex]
                    if(rank.rank > 3){
                        this.medalText[index].text = rank.rank.toString()
                        this.medalImage[index].sprite = this.medalSprites[3]
                    }else{
                        this.medalImage[index].sprite = this.medalSprites[index]
                        this.medalText[index].text = ''
                    }
                    this.medalImage[index].enabled = true
                    this.profileImage[index].enabled = true
                    this.SetProfileImage(this.profileImage[index], rank.member)
                    this.playerName[index].text = rank.name
                    this.score[index].text = rank.score.toString()
                }else{
                    this.medalImage[index].enabled = false
                    this.medalText[index].text = ''
                    this.profileImage[index].enabled = false
                    this.playerName[index].text = ''
                    this.score[index].text = ''
                }
            }

        }, (error) => { console.log("에러 : ", error)})
    }


    OnSetScoreResult(setScoreResponse : SetScoreResponse){
        console.log("점수 설정" + setScoreResponse.isSuccess)
    }
    
    SetProfileImage(image : Image, userId : string){
        ZepetoWorldHelper.GetProfileTexture(userId, (texture : Texture) => {
            
            // console.log(sprite)
            // console.log(this.sampleImage)
            // console.log(this.sampleImage.gameObject)
            // console.log(this.sampleImage.gameObject.tag)
            // console.log(this.sampleImage.gameObject.name)
            // console.log(this.sampleImage.sprite)
            image.sprite = this.GetSprite(texture)
            //this.sampleImage.SetNativeSize()
        }, (error : string) => {
            console.log("에러 : " + error)
        })
    }

    GetSprite(texture : Texture){
        let rect : Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }
    Update(){
        if(this.isStart){
            this.timer += Time.deltaTime
            this.timerText.text = this.timer.toString()
        }
        
        // if(this.player.GetIsGround()){
        //     var a = this.player.GetInfoGround()
        //     //떨어짐 판정
        //     //게임종료
        //     //리더보드, 데이터베이스, 체크 포인트
        //     // checkedPoint = this.player.GetInfoGround().position;
        //     //sendMessage(a.pointNum)
        // }
    }

    IfFloor(){
        // 체크 포인트로 이동
        // 모든 플레이어에 대해 이동을 실행
    }

}