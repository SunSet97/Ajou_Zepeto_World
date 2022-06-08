import { Collider, GameObject, LayerMask, Mathf, Sprite, Time } from 'UnityEngine'
import { Button, Image, Text } from 'UnityEngine.UI'
import { CharacterState, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LeaderBoard from './LeaderBoard'

export default class JumpMapUIController extends ZepetoScriptBehaviour {

    public gameStartButton : Button


    public readyPanel : GameObject
    public readyImage : Image
    @Header("3 2 1 시작 순으로")
    public readySprites : Sprite[]
    public leaderBoard : GameObject
    private _leaderBoard : LeaderBoard

   

    Start() {
        // this.gameStartButton = GameObject.Instantiate<GameObject>(this.gameStartButtonPrefab).GetComponent<Button>()
        this.gameStartButton.gameObject.SetActive(false)
        this._leaderBoard = this.leaderBoard.GetComponent<LeaderBoard>()
        this.gameStartButton.onClick.AddListener(() =>{
            this.gameStartButton.gameObject.SetActive(false)
            //정지 버튼 SetActive(true)
            var player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
            player.StopMoving()
            player.transform.position = this.transform.position
            player.transform.rotation = this.transform.rotation
            player.characterController.enabled = false
            this.StartCoroutine(this.GameReady())
        })
    }

    *GameReady(){
        var time = 3
        //위치 이동 및 움직이기 정지, 대기
        this.readyPanel.SetActive(true)
        this.readyImage.gameObject.SetActive(true)
        var player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
        while(time > 0){
            // player.state
            time -= Time.deltaTime
            var idx = 3 - Mathf.Ceil(time)
            console.log(idx)
            this.readyImage.sprite = this.readySprites[idx]
            this.readyImage.SetNativeSize()
            yield null
        }
        player.characterController.enabled = true
        this._leaderBoard.GameStart()

        this.readyImage.sprite = this.readySprites[3]
        this.readyImage.SetNativeSize()
        time = 1
        while(time > 0){
            time -= Time.deltaTime
            yield null
        }

        this.readyImage.gameObject.SetActive(false)
        this.readyPanel.SetActive(false)
    }
    


    OnTriggerEnter(col : Collider){
        if(col.gameObject.layer == LayerMask.NameToLayer("LocalPlayer")){
            if(!this._leaderBoard.isStart)
                this.gameStartButton.gameObject.SetActive(true)
        }
    }

    OnTriggerExit(col : Collider){
        if(col.gameObject.layer == LayerMask.NameToLayer("LocalPlayer")){
            this.gameStartButton.gameObject.SetActive(false)
        }
    }
}