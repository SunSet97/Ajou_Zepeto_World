import { Camera, Color, GameObject, GL, Rect, Screen } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class ScreenRatioFixer extends ZepetoScriptBehaviour {

    public image : GameObject


    public Start(){
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // this.SetResolution();
            this.SetLetterBox();
            // this.image.SetActive(false)
        })
    }
    public SetResolution()
    {
        var setWidth = 1920; // 사용자 설정 너비
        var setHeight = 1080; // 사용자 설정 높이

        var deviceWidth = Screen.width; // 기기 너비 저장
        var deviceHeight = Screen.height; // 기기 높이 저장
        Screen.SetResolution(setWidth, (((deviceHeight as float) / deviceWidth) * setWidth), true); // SetResolution 함수 제대로 사용하기
        
        if ((setWidth as float) / setHeight < (deviceWidth as float) / deviceHeight) // 기기의 해상도 비가 더 큰 경우
        {
            var newWidth = ((setWidth as float) / setHeight) / ((deviceWidth as float) / deviceHeight); // 새로운 너비
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.rect = new Rect((1.0 - newWidth) / 2.0, .0, newWidth, 1.0); // 새로운 Rect 적용
        }
        else // 게임의 해상도 비가 더 큰 경우
        {
            var newHeight = ((deviceWidth as float) / deviceHeight) / ((setWidth as float) / setHeight); // 새로운 높이
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.rect = new Rect(.0, (1.0 - newHeight) / 2.0, 1.0, newHeight); // 새로운 Rect 적용
        }   
    }

    SetLetterBox()
    {
        var camera : Camera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera;
        var rect : Rect = camera.rect;
        var scaleheight = (Screen.width / Screen.height) / (16.0 / 9.0); // (가로 / 세로)
        var scalewidth = 1.0 / scaleheight;
        if (scaleheight < 1)
        {
            rect.height = scaleheight;
            rect.y = (1.0 - scaleheight) / 2.0;
        }
        else
        {
            rect.width = scalewidth;
            rect.x = (1.0 - scalewidth) / 2.0;
        }
        camera.rect = rect;
    }

    OnPreCull(){
        GL.Clear(true, true, Color.black);
    }
}