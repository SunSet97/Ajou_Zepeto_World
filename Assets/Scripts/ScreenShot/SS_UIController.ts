import { GameObject, Rect, RectTransform, Screen, Vector2 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from '../AnimationLinker'
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
    
    @Header("Pose Panels")
    public poseDefaultPanels : GameObject
    public poseModePanels : GameObject

    @Header("Pose Mode")
    public poseModeButton : Button
    public poseExitButton : Button
    public gestureButton : Button
    public poseButton : Button
    public gestureContent : GameObject
    public poseContent : GameObject
    public infinityButton : Button

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

        this.poseModeButton.onClick.AddListener(() =>{
            this.poseDefaultPanels.SetActive(false)
            this.poseModePanels.SetActive(true)
        })

        this.poseExitButton.onClick.AddListener(() =>{
            this.poseDefaultPanels.SetActive(true)
            this.poseModePanels.SetActive(false)
        })
        
        this.gestureButton.onClick.AddListener(() =>{
            this.poseContent.SetActive(false)
            this.gestureContent.SetActive(true)
        })

        this.poseButton.onClick.AddListener(() =>{
            this.poseContent.SetActive(true)
            this.gestureContent.SetActive(false)
        })
        this.infinityButton.onClick.AddListener(() =>{
            AnimationLinker.instance.isInfinite = !AnimationLinker.instance.isInfinite
        })

        // for(var index = 0; index < this.poseContent.transform.childCount; index++){
        //     this.poseContent.transform.GetChild(index).GetComponent<Button>().onClick.AddListener(() =>{
                
        //     })
        // }

        // for(var index = 0; index < this.poseContent.transform.childCount; index++){
        //     this.poseContent.transform.GetChild(index).GetComponent<Button>().onClick.AddListener(() =>{
                
        //     })
        // }
    }
}