import { Collider, GameObject, LayerMask, Mathf, Time } from 'UnityEngine'
import { Button, Text } from 'UnityEngine.UI'
import { CharacterState, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LeaderBoard from './LeaderBoard'

export default class JumpMapUIController extends ZepetoScriptBehaviour {

    public gameStartButton : Button


    public readyPanel : GameObject
    public readyText : Text
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
        this.readyText.gameObject.SetActive(true)
        var player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
        while(time > 0){
            // player.state
            time -= Time.deltaTime
            this.readyText.text = Mathf.Ceil(time).toString()
            yield null
        }
        player.characterController.enabled = true
        this.readyText.gameObject.SetActive(false)
        this.readyPanel.SetActive(false)
        this._leaderBoard.GameStart()
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