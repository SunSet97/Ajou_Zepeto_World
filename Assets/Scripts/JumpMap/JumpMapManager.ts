import { GameObject, Rect, Sprite, Texture, Texture2D, Time, Transform, Vector2 } from 'UnityEngine';
import { Image, Text } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRangeRankResponse, Leaderboard, LeaderboardAPI, Rank, RankInfo, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard';
import { ZepetoWorldHelper } from 'ZEPETO.World';

export default class JumpMapManager extends ZepetoScriptBehaviour {

    private profileImage : Image[]
    private medalImage : Image[]
    private medalText : Text[]
    private playerName : Text[]

    @Header("1, 2, 3위, 그 외 순서대로 넣으세요.")
    public medalSprites : Sprite[]
    public leaderBoardParent : GameObject
    public timerText : Text
    public resetRule : ResetRule


    //public player : CharacterFloorDetector
    @Header("디버그용입니다~")
    public timer : float
    public isStart : bool
    
    private readonly leaderboardId : string = "3d6837f6-e016-426b-9081-ee0c27d4dd4"
    Start(){
        this.profileImage = new Array<Image>(5)
        this.medalImage = new Array<Image>(5)
        this.medalText = new Array<Text>(5)
        this.playerName = new Array<Text>(5)
        // console.log(this._leaderBoards)
        // console.log(this._leaderBoards.Capacity)
        for(var i = 0; i < this.leaderBoardParent.transform.childCount; i++){
            console.log(1)
            this.medalImage[i] = this.leaderBoardParent.transform.GetChild(i).GetChild(0).GetComponent<Image>()
            console.log(2)
            this.medalText[i] = this.leaderBoardParent.transform.GetChild(i).GetChild(0).GetChild(0).GetComponent<Text>()
            console.log(3)
            this.profileImage[i] = this.leaderBoardParent.transform.GetChild(i).GetChild(1).GetComponent<Image>()
            console.log(4)
            this.playerName[i] = this.leaderBoardParent.transform.GetChild(i).GetChild(2).GetComponent<Text>()
            console.log(5)
        }
    }
    GameStart(){
        if(!this.isStart){
            this.isStart = true
            this.timer = 0
            this.timerText.gameObject.SetActive(true)
        }
    }

    GameEnd(){
        if(this.isStart){
            //플레이어에 붙은 스크립트 삭제
            //GameObject.DestroyImmediate(this.player)
            LeaderboardAPI.SetScore(this.leaderboardId, this.timer, this.OnSetScoreResult, (error) => {console.log("에러 : " + error)})
            LeaderboardAPI.GetRangeRank(this.leaderboardId, 1, 10000, this.resetRule, false, (response : GetRangeRankResponse) => {
                console.log("리더보드 불러오기 결과 : " + response.isSuccess)
                //멤버는 ㅁㄹ, 이름은 이름, score - number로 됨 float 안됨, rank - 1등인가
                console.log("내 랭킹" + response.rankInfo.myRank.member + " " + response.rankInfo.myRank.name + " " + response.rankInfo.myRank.score + " " + response.rankInfo.myRank.rank)
                console.log("총 랭킹 카운트" + response.rankInfo.totalRankCount)
        
                // 자신의 랭크
                // for(var index = 0; index < response.rankInfo.Ranks.length; index++){
                //     console.log("랭크 : " + response.rankInfo.Ranks[index].member + " " + response.rankInfo.Ranks[index].name + " " + response.rankInfo.Ranks[index].score + " " + response.rankInfo.Ranks[index].rank)
                // }
                
                // console.log("--------------------------")
        
                // for(var index = 0; index < response.rankInfo.rankList.length; index++){
                for(var index = 0; index < response.rankInfo.rankList.length; index++){
                    if(index > 5) break;
                    var rank : Rank = response.rankInfo.rankList[index]
                    console.log("랭크리스트 : " + rank.name + "\n점수 : " + rank.score + ", 랭킹 : " + rank.rank)

                    if(rank.rank > 3){
                        this.medalText[index].text = rank.rank.toString()
                        this.medalImage[index].sprite = this.medalSprites[3]
                        // console.log(rank.rank.toString() + "  " + this.medalSprites[3])
                    }else{
                        this.medalImage[index].sprite = this.medalSprites[index]
                        this.medalText[index].text = ''
                        // console.log(this.medalSprites[index] + "  " + '')
                    }
                    this.medalImage[index].enabled = true
                    this.profileImage[index].enabled = true
                    this.SetProfileImage(this.profileImage[index], rank.member)
                    this.playerName[index].text = rank.name
                }
                for(var index = response.rankInfo.rankList.length; index < this.leaderBoardParent.transform.childCount; index++){
                    if(index > 5) break;
                    // const leaderBoard = this._leaderBoards[index]
                    this.medalImage[index].enabled = false
                    this.medalText[index].text = ''
                    this.profileImage[index].enabled = false
                    this.playerName[index].text = ''
                }
            }, (error) => {"에러 : " + console.log(error)})
            //LeaderboardAPI.GetRangeRank("", 1, 100, null, )
            this.timerText.gameObject.SetActive(false)
            this.timer = 0
            this.isStart = false
        }
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

    GetSprite(texture:Texture){
        let rect:Rect = new Rect(0, 0, texture.width, texture.height);
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