import { GameObject, Rect, RectTransform, Screen, Vector2 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ScreenShotController from './ScreenShotController'

export default class SS_UIController extends ZepetoScriptBehaviour {

    public safeAreaObject : GameObject

    @Header("ScreenShot Panels")
    public DefaultPanel : GameObject
    public screenShotModePanel : GameObject
    public screenShotResultPanel : GameObject


    @Header("ScreenShot Mode")
    public screenShotModeButton : Button
    public shootScreenShotButton : Button
    public screenShotModeExitButton : Button

    @Header("ScreenShot Result")
    public saveButton : Button
    public shareButton : Button
    public createFeedButton : Button
    public screenShotResultExitButton : Button

    @Header("스크립트 모음 오브젝트")
    public screenShotController : GameObject

    private _screenShotController : ScreenShotController
    


    Awake(){
        this._screenShotController = this.screenShotController.GetComponent<ScreenShotController>()
    }


    AddVector2(t1 : Vector2, t2 : Vector2) : Vector2{
        return new Vector2(t1.x + t2.x, t1.y + t2.y)
    }

    Start(){


        // SafeArea 설정
        let safeArea: Rect = Screen.safeArea;
        let newAnchorMin = safeArea.position;
        let newAnchorMax = this.AddVector2(safeArea.position, safeArea.size)
        newAnchorMin.x /= Screen.width;
        newAnchorMax.x /= Screen.width;
        newAnchorMin.y /= Screen.height;
        newAnchorMax.y /= Screen.height;
        
        let rect = this.safeAreaObject.GetComponent<RectTransform>();
        rect.anchorMin = newAnchorMin;
        rect.anchorMax = newAnchorMax;
        
        this.screenShotModeButton.onClick.AddListener(() => {
            //스크린샷 모드 키기
            console.log("눌렀자나")
            this.DefaultPanel.SetActive(false)
            this.screenShotModePanel.SetActive(true)
            //기존 버튼 끄기
        })

        this.screenShotModeExitButton.onClick.AddListener(() => {
            //스크린샷 모드 끄기
            //기존 버튼 키기
            this.DefaultPanel.SetActive(true)
            this.screenShotModePanel.SetActive(false)
        })

        // 스크린샷
        this.shootScreenShotButton.onClick.AddListener(() => {
            this._screenShotController.TakeScreenShot()
            //결과 보여주기
            this.screenShotModePanel.SetActive(false)
            this.screenShotResultPanel.SetActive(true)
        })


        //ScreenShot Result

        this.screenShotResultExitButton.onClick.AddListener(() => {
            //스크린샷 결과 창 끄기
            this.screenShotResultPanel.SetActive(false)
            this.DefaultPanel.SetActive(true)
        })

        this.saveButton.onClick.AddListener(() => {
            this._screenShotController.SaveScreenShot()
        })
        
        this.shareButton.onClick.AddListener(() =>{
            this._screenShotController.ShareScreenShot()
        })

        this.createFeedButton.onClick.AddListener(() =>{
            this._screenShotController.CreateFeedScreenShot()
        })

    }
}