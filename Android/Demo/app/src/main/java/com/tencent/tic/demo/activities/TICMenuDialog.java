package com.tencent.tic.demo.activities;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.MimeTypeMap;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.RadioButton;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.tencent.teduboard.TEduBoardController;
import com.tencent.tic.demo.R;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.Arrays;
import java.util.List;


public class TICMenuDialog extends Dialog implements View.OnClickListener {

    private final static String TAG                                     = "TICMenuDialog";
    final static String LOCAL_FILE = "local:";

    //涂鸭工具集映射
    static class ToolType {
        ToolType(String name, int type) {
            this.name = name;
            this.type = type;
        }
        String name;
        int type;
    }

    static class KValue {
        KValue(String key, String value) {
            this.key = key;
            this.value = value;
        }

        String key;
        String value;
    }

    private final static String [] Images_URL = {
            "https://main.qcloudimg.com/raw/f221068a0de6040c42d73344a72c387b.jpg",
            "https://main.qcloudimg.com/raw/406551d15f1792b65d6586756b445c92.jpg",
            "https://main.qcloudimg.com/raw/372a34196487aac1cb65b542a6633af5.jpg",
            "https://main.qcloudimg.com/raw/ee75b1d4fa855cba8072839ed924ab86.jpg",
            "https://main.qcloudimg.com/raw/ee67a580472142bd618a8e42ce62a28b.jpg",
            "https://main.qcloudimg.com/raw/692c1da42fc56c62da866516b33e05f1.jpg",
            "https://main.qcloudimg.com/raw/4da1910077d346d8aa62b2b27c11459a.jpg",
            "https://main.qcloudimg.com/raw/a3a3eda87602bd3a346261a9be95b78d.jpg",
            "https://main.qcloudimg.com/raw/9cea6ec724ac3ca034a0424ec0afe8f5.jpg",
            "https://main.qcloudimg.com/raw/0e8988b172633f3381a9135494207f3a.jpg",
            "https://main.qcloudimg.com/raw/e8798f7bd522ab3ffe0a43d8b9d346cd.jpg"
    };

    //PPT转码后的H5文件，
    private final static TEduBoardController.TEduBoardTranscodeFileResult H5_PPT_URL[]= {
            new TEduBoardController.TEduBoardTranscodeFileResult("欢迎新同学","https://ppt2h5-1259648581.file.myqcloud.com/ghikv1979vq1bhl3jtpb/index.html",23,"960x540"),
            new TEduBoardController.TEduBoardTranscodeFileResult("腾讯课堂介绍","https://transcode-result-1259648581.file.myqcloud.com/g6lcd5qcpqrgit7mopob/",9,"1766x987")
    };

    //H5背景
    private final static KValue [] H5_BK_URL = {
            new KValue("https://www.qq.com/", "QQ"),
            new KValue("http://b.hiphotos.baidu.com/image/h%3D300/sign=92afee66fd36afc3110c39658318eb85/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg", "美图"),
    };

    //H5文件
    private final static KValue [] H5_FILE_URL = {
            new KValue("https://cloud.tencent.com/", "腾讯云"),
    };

    //Video
    private final static KValue [] VideoRes_URL = {
            new KValue("https://tic-res-1259648581.cos.ap-shanghai.myqcloud.com/demo/tiw-vod.mp4", "腾讯教育")
    };


    final ToolType [] mToolMap = {
            new ToolType("鼠标", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_MOUSE),
            new ToolType("铅笔", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN),
            new ToolType("橡皮", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER),
            new ToolType("直线", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE),
            new ToolType("激光教鞭", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LASER),
            new ToolType("空心椭圆", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_OVAL),
            new ToolType("空心矩形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT),
            new ToolType("实心椭圆", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_OVAL_SOLID),
            new ToolType("实心矩形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT_SOLID),
            new ToolType("点选", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_POINT_SELECT),
            new ToolType("框选", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT_SELECT),
            new ToolType("文本", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_TEXT),
            new ToolType("手势缩放", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ZOOM_DRAG)
    };

    final ToolType [] ColorMap = {
            new ToolType("白", 0xFFFFFFFF),
            new ToolType("红", 0xFFFF0000),
            new ToolType("橙", 0xFFFFA500),
            new ToolType("黄", 0xFFFFFF00),
            new ToolType("绿", 0xFF00FF00),
            new ToolType("青", 0xFF00FFFF),
            new ToolType("蓝", 0xFF0000ff),
            new ToolType("紫", 0xFF800080),
    };

    final ToolType [] TextStyle = {
            new ToolType("常规", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_NORMAL),
            new ToolType("粗体", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_BOLD),
            new ToolType("斜体", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_ITALIC),
            new ToolType("粗斜体", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_BOLD_ITALIC),
    };

    final ToolType [] FitMode = {
            new ToolType("默认模式", TEduBoardController.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_NONE),
            new ToolType("填满白板", TEduBoardController.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_CENTER_INSIDE),
            new ToolType("填满容器", TEduBoardController.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_CENTER_COVER),
    };

    public interface IMoreListener {
        //TRTC
        void onEnableAudio(boolean bEnableAudio);
        void onSwitchAudioRoute(boolean speaker);
        void onEnableCamera(boolean bEnableCamera);
        void onSwitchCamera(boolean bFrontCamera);

        //Board(涂鸭操作)
        void onSetDrawEnable(boolean SetDrawEnable);
        void onSyncDrawEnable(boolean syncDrawEnable);
        void onSetHandwritingEnable(boolean syncDrawEnable);

        void onSetToolType(int type);
        void onBrushThin(int size);
        void onSetTextSize(int size);
        void onScale(int scale);
        void onSetRatio(String scale);
        void onSetFitMode(int mode);

        void onSetBrushColor(int color);
        void onSetTextColor(int color);
        void onSetTextStyle(int style);
        void onSetBackgroundColore(int color);
        void onSetBackgroundImage(String path);
        void onSetBackgroundH5(String url);


        void onUndo();
        void onRedo();
        void onClear();
        void onReset();

        //Board(白板操作)
        void onAddBoard(String id);
        void onDeleteBoard(String boardId);
        void onGotoBoard(String boardId);
        void onPrevStep();
        void onNextStep();
        void onPrevBoard();
        void onNextBoard();


        //Board(文件操作)
        void onTransCodeFile(TEduBoardController.TEduBoardTranscodeFileResult result);
        void onAddH5File(String url);
        void onDeleteFile(String boardId);
        void onGotoFile(String boardId);
        void onAddImagesFile(List<String> urls);


        //Video()
        void onPlayVideoFile(String url);
        void onShowVideoCtrl(boolean value);
    }

    //显示时的值
    public static class SettingCacheData {
        //trtc
        boolean AudioEnable;
        boolean AudioRoute;
        boolean CameraEnable;
        boolean CameraFront;

        //board(涂鸭)
        boolean isDrawEnable;       //是否可以涂鸭
        boolean isSynDrawEnable; //是否将你画的涂鸭同步给其他人
        boolean isHandwritingEnable;
        int ToolType;
        int BrushThin;
        int BrushColor;
        int TextColor;
        int TextStyle;
        String TextFamily;
        int BackgroundColor;
        int GlobalBackgroundColor;
        int TextSize;
        int ScaleSize;
        int FitMode;
        String ration;
        String BackgroundImage;
        boolean canRedo;
        boolean canUndo;

        //board(白板操作)
        String currentBoardId;
        List<String> boardIds;

        //board(文件操作)
        String currentFileId;
        List<TEduBoardController.TEduBoardFileInfo> files;
    };


    WeakReference<IMoreListener> mMoreListener;
    SettingCacheData mSettingData;

    //
    ArrayAdapter<String> boardArray;

    public TICMenuDialog(Context context, IMoreListener listener) {
        super(context, R.style.room_more_dlg);
        mMoreListener = new WeakReference<>(listener);
        mSettingData = new SettingCacheData();

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dlg_setting);
        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);

        //initView(mSettingData);
    }

    @Override
    protected void onStart() {
        initView(mSettingData);
        super.onStart();
    }

    public void show(SettingCacheData settingData) {
        mSettingData = settingData;
        show();
    }

    private void initView(SettingCacheData settingData) {
        //返回
        findViewById(R.id.btn_back).setOnClickListener(this);

        //---------TRTC----------
        CheckBox audio_enalbe = findViewById(R.id.audio_enable);
        audio_enalbe.setOnClickListener(this);
        audio_enalbe.setChecked(settingData.AudioEnable);

        RadioButton mRbAudioEarpiece   = (RadioButton)findViewById(R.id.audio_earpiece);
        mRbAudioEarpiece.setOnClickListener(this);
        mRbAudioEarpiece.setChecked(!settingData.AudioRoute);

        RadioButton mRbAudioSpeaker   = (RadioButton)findViewById(R.id.audio_speaker);
        mRbAudioSpeaker.setOnClickListener(this);
        mRbAudioSpeaker.setChecked(settingData.AudioRoute);

        CheckBox video_enalbe = findViewById(R.id.camera_enalbe);
        video_enalbe.setOnClickListener(this);
        video_enalbe.setChecked(settingData.CameraEnable);

        RadioButton mRbCameraFront   = (RadioButton)findViewById(R.id.camera_front);
        mRbCameraFront.setOnClickListener(this);
        mRbCameraFront.setChecked(settingData.CameraFront);

        RadioButton mRbCameraBack   = (RadioButton)findViewById(R.id.camera_back);
        mRbCameraBack.setOnClickListener(this);
        mRbCameraBack.setChecked(!settingData.CameraFront);

        //---------Board(涂鸭)---------
        CheckBox board_isDrawEnable = findViewById(R.id.board_setDrawEnable);
        board_isDrawEnable.setOnClickListener(this);
        board_isDrawEnable.setChecked(settingData.isDrawEnable);

        CheckBox board_isSycDrawEnable = findViewById(R.id.board_SynDrawEnable);
        board_isSycDrawEnable.setOnClickListener(this);
        board_isSycDrawEnable.setChecked(settingData.isSynDrawEnable);

        CheckBox HandwritingEnable = findViewById(R.id.board_setHandwritingEnable);
        HandwritingEnable.setOnClickListener(this);
        HandwritingEnable.setChecked(settingData.isHandwritingEnable);

        int posToolType = 0;
        ArrayAdapter<String> adapter=new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < mToolMap.length; i++) {
            adapter.add( mToolMap[i].name);
            if (settingData.ToolType == mToolMap[i].type) {
                posToolType = i;
            }
        }
        Spinner spToolType = (Spinner)findViewById(R.id.sp_SetToolType);
        spToolType.setAdapter(adapter);
        spToolType.setSelection(posToolType, false);
        findViewById(R.id.btn_SetToolType).setOnClickListener(this);


        findViewById(R.id.btn_BrushThin).setOnClickListener(this);
        ((TextView)findViewById(R.id.tv_BrushThin)).setText(String.valueOf(settingData.BrushThin));
        SeekBar sbVideoBitrate = findViewById(R.id.sk_BrushThin);
        sbVideoBitrate.setProgress(settingData.BrushThin);
        sbVideoBitrate.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ((TextView)findViewById(R.id.tv_BrushThin)).setText(String.valueOf(progress));
            }
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });

        findViewById(R.id.btn_SetTextSize).setOnClickListener(this);
        ((TextView)findViewById(R.id.tv_SetTextSize)).setText(String.valueOf(settingData.TextSize));
        SeekBar sk_TextSize = (SeekBar)findViewById(R.id.sk_SetTextSize);
        sk_TextSize.setProgress(settingData.TextSize);
        sk_TextSize.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ((TextView)findViewById(R.id.tv_SetTextSize)).setText(String.valueOf(progress));
            }
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });

        //缩放
        findViewById(R.id.btn_scaleBoard).setOnClickListener(this);
        ((TextView)findViewById(R.id.tv_scaleBoard)).setText(String.valueOf(settingData.ScaleSize));
        SeekBar sk_scaleBoard = (SeekBar)findViewById(R.id.sk_scaleBoard);
        sk_scaleBoard.setProgress(settingData.ScaleSize);
        sk_scaleBoard.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ((TextView)findViewById(R.id.tv_scaleBoard)).setText(String.valueOf(progress));
            }
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });

        //宽高比
        RadioButton mRbBoardRation169   = (RadioButton)findViewById(R.id.board_16_9);
        String ratio169 = mRbBoardRation169.getText().toString();
        mRbBoardRation169.setOnClickListener(this);
        mRbBoardRation169.setChecked(!TextUtils.isEmpty(ratio169) && ratio169.equals(settingData.ration));

        RadioButton mRbBoardRation43   = (RadioButton)findViewById(R.id.board_4_3);
        String ratio43 = mRbBoardRation43.getText().toString();
        mRbBoardRation43.setOnClickListener(this);
        mRbBoardRation43.setChecked(!TextUtils.isEmpty(ratio43) && ratio43.equals(settingData.ration));


        //填充模式
        int fitModeType = 0;
        ArrayAdapter<String> fitMode_adapter=new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < FitMode.length; i++) {
            fitMode_adapter.add( FitMode[i].name);
            if (settingData.FitMode == FitMode[i].type) {
                fitModeType = i;
            }
        }
        Spinner spFitMode = (Spinner)findViewById(R.id.sp_fitMode);
        spFitMode.setAdapter(fitMode_adapter);
        spFitMode.setSelection(fitModeType, false);
        findViewById(R.id.btn_fitMode).setOnClickListener(this);

        //撤销和重做
        Button bt_undo = findViewById(R.id.btn_undo);
        bt_undo.setEnabled(settingData.canUndo);
        bt_undo.setOnClickListener(this);

        Button bt_redo = findViewById(R.id.btn_redo);
        bt_redo.setEnabled(settingData.canRedo);
        bt_redo.setOnClickListener(this);

        findViewById(R.id.btn_clear).setOnClickListener(this);
        findViewById(R.id.btn_reset).setOnClickListener(this);

        int pos_brushcolor = 0;
        int pos_textcolor = 0;
        int pos_backgroundcolor = 0;
        ArrayAdapter<String> colors =new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < ColorMap.length; i++) {
            colors.add(ColorMap[i].name);

            if (ColorMap[i].type == settingData.BrushColor) {
                pos_brushcolor = i;
            }
            if (ColorMap[i].type == settingData.TextColor) {
                pos_textcolor = i;
            }
            if (ColorMap[i].type == settingData.BackgroundColor) {
                pos_backgroundcolor = i;
            }
        }
        Spinner spBruchColor = (Spinner)findViewById(R.id.sp_setBrushColor);
        spBruchColor.setAdapter(colors);
        spBruchColor.setSelection(pos_brushcolor, false);
        findViewById(R.id.btn_setBrushColor).setOnClickListener(this);

        Spinner spTextColor = (Spinner)findViewById(R.id.sp_setTextColor);
        spTextColor.setAdapter(colors);
        spTextColor.setSelection(pos_textcolor, false);
        findViewById(R.id.btn_setTextColor).setOnClickListener(this);

        int pos_textstyle = 0;
        ArrayAdapter<String> textstyle = new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < TextStyle.length; i++) {
            textstyle.add(TextStyle[i].name);
            if (TextStyle[i].type == settingData.TextStyle) {
                pos_textstyle = i;
            }
        }

        Spinner spTextStyle = (Spinner)findViewById(R.id.sp_setTextStyle);
        spTextStyle.setAdapter(textstyle);
        spTextStyle.setSelection(pos_textstyle, false);
        findViewById(R.id.btn_setTextStyle).setOnClickListener(this);

        Spinner spbackgroundColor = (Spinner)findViewById(R.id.sp_setBackgroundColor);
        spbackgroundColor.setAdapter(colors);
        spbackgroundColor.setSelection(pos_backgroundcolor, false);
        findViewById(R.id.btn_setBackgroundColor).setOnClickListener(this);

        ArrayAdapter<String> imgArray =new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        String[] imgs = null;
        try {
            imgs = getContext().getAssets().list("img");
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (imgs != null) {
            for (String file : imgs) {
                String extension = MimeTypeMap.getFileExtensionFromUrl(file);
                if (extension != null && (extension.equals("jpg") || extension.equals("png") || extension.equals("bmp"))) {
                    imgArray.add(file);
                }
            }
        }
        Spinner backimage = (Spinner)findViewById(R.id.sp_setBackgroundImage);
        backimage.setAdapter(imgArray);
        backimage.setSelection(0, false);
        findViewById(R.id.btn_setBackgroundImage).setOnClickListener(this);


        ArrayAdapter<String> bgh5Array =new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < H5_BK_URL.length; i++) {
            bgh5Array.add(H5_BK_URL[i].value);
        }
        Spinner bgh5 = (Spinner)findViewById(R.id.sp_setBackgroundH5);
        bgh5.setAdapter(bgh5Array);
        bgh5.setSelection(0, false);
        findViewById(R.id.btn_setBackgroundH5).setOnClickListener(this);


        //---------Board(白板)---------
        findViewById(R.id.btn_prevBoard).setOnClickListener(this);
        findViewById(R.id.btn_nextBoard).setOnClickListener(this);

        findViewById(R.id.btn_prevStep).setOnClickListener(this);
        findViewById(R.id.btn_nextStep).setOnClickListener(this);


        findViewById(R.id.btn_addBoard).setOnClickListener(this);
        findViewById(R.id.btn_deleteBoard).setOnClickListener(this);
        findViewById(R.id.btn_gotoBoard).setOnClickListener(this);

        int pos = 0;
        boardArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        if (settingData.boardIds != null && settingData.boardIds.size() > 0) {
            if (!TextUtils.isEmpty(mSettingData.currentBoardId)) {
                pos = settingData.boardIds.indexOf(mSettingData.currentBoardId);
            }

            boardArray.addAll(settingData.boardIds);
        }
        Spinner deleteboard = (Spinner)findViewById(R.id.sp_deleteBoard);
        deleteboard.setAdapter(boardArray);
        deleteboard.setSelection(pos >= 0 ? pos : 0, false );

        Spinner gotoboard = (Spinner)findViewById(R.id.sp_gotoBoard);
        gotoboard.setAdapter(boardArray);
        gotoboard.setSelection(pos >=0 ? pos : 0, false );


        //---------Board(文件)---------
        findViewById(R.id.btn_addFile).setOnClickListener(this);
        findViewById(R.id.btn_deleteFile).setOnClickListener(this);
        findViewById(R.id.btn_switchFile).setOnClickListener(this);
        findViewById(R.id.btn_addImagesFile).setOnClickListener(this);
        findViewById(R.id.btn_addH5File).setOnClickListener(this);

        ArrayAdapter<String> pptArray =new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (TEduBoardController.TEduBoardTranscodeFileResult file : H5_PPT_URL) {
            pptArray.add(file.title);
        }
        Spinner sp_addFile = (Spinner)findViewById(R.id.sp_addFile);
        sp_addFile.setAdapter(pptArray);

        int pos_file = 0;
        ArrayAdapter<String> filesArray = new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        if (settingData.files != null) {
            int i = 0;
            for(TEduBoardController.TEduBoardFileInfo info : settingData.files) {
                filesArray.add(TextUtils.isEmpty(info.title) ? info.fileId : info.title);
                if (info.fileId.equals(mSettingData.currentFileId)) {
                    pos_file = i;
                }
                i++;
            }
        }

        //H5文件
        ArrayAdapter<String> H5FileArray =new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < H5_FILE_URL.length; i++) {
            H5FileArray.add(H5_FILE_URL[i].value);
        }
        Spinner H5FileSp = (Spinner)findViewById(R.id.sp_addH5File);
        H5FileSp.setAdapter(H5FileArray);
        H5FileSp.setSelection(0, false);


        Spinner deletefile = (Spinner)findViewById(R.id.sp_deleteFile);
        deletefile.setAdapter(filesArray);
        deletefile.setSelection(pos_file >=0 ? pos_file : 0, false);

        Spinner switchfile = (Spinner)findViewById(R.id.sp_switchFile);
        switchfile.setAdapter(filesArray);
        switchfile.setSelection(pos_file >=0 ? pos_file : 0, false);


        //---------视频(video)---------
        findViewById(R.id.btn_addVideoFile).setOnClickListener(this);
        findViewById(R.id.btn_video_ctrl_enalbe).setOnClickListener(this);

        ArrayAdapter<String> videoArray =new ArrayAdapter<String>(this.getContext(),android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < VideoRes_URL.length; i++) {
            videoArray.add(VideoRes_URL[i].value);
        }
        Spinner videoSp = (Spinner)findViewById(R.id.sp_addVideoFile);
        videoSp.setAdapter(videoArray);
        videoSp.setSelection(0, false);

    }

    @Override
    public void onClick(View v) {
        IMoreListener listener = mMoreListener.get();
        if (listener == null) {
            return;
        }

        int id = v.getId();
        switch (id) {
            case R.id.btn_back:
                dismiss();
                break;

            //TRTC
            case R.id.audio_enable:
                boolean audio_enable = ((CheckBox)v).isChecked();
                listener.onEnableAudio(audio_enable);
                break;

            case R.id.audio_earpiece:
                boolean audio_earpiece = ((RadioButton)v).isChecked();
                listener.onSwitchAudioRoute(!audio_earpiece);
                break;

            case R.id.audio_speaker:
                boolean audio_speaker = ((RadioButton)v).isChecked();
                listener.onSwitchAudioRoute(audio_speaker);
                break;

            case R.id.camera_enalbe:
                boolean camera_enalbe = ((CheckBox)v).isChecked();
                listener.onEnableCamera(camera_enalbe);
                break;

            case R.id.camera_front:
                boolean camera_front = ((RadioButton)v).isChecked();
                listener.onSwitchCamera(camera_front);
                break;

            case R.id.camera_back:
                boolean camera_back = ((RadioButton)v).isChecked();
                listener.onSwitchCamera(!camera_back);
                break;

           //Board(涂鸭)
            case R.id.board_setDrawEnable:
                boolean setDrawEnable = ((CheckBox)v).isChecked();
                listener.onSetDrawEnable(setDrawEnable);
                break;

            case R.id.board_SynDrawEnable:
                boolean syncDrawEnable = ((CheckBox)v).isChecked();
                listener.onSyncDrawEnable(syncDrawEnable);
                break;

            case R.id.board_setHandwritingEnable:
                boolean setHandwritingEnable = ((CheckBox)v).isChecked();
                listener.onSetHandwritingEnable(setHandwritingEnable);
                break;

            case R.id.btn_SetToolType:
                int pos = ((Spinner)findViewById(R.id.sp_SetToolType)).getSelectedItemPosition();
                if (pos < mToolMap.length) {
                    int type = mToolMap[pos].type;
                    listener.onSetToolType(type);
                }
                break;

            case R.id.btn_BrushThin:
                int BrushThin = ((SeekBar)findViewById(R.id.sk_BrushThin)).getProgress();
                listener.onBrushThin(BrushThin);
                break;

            case R.id.btn_SetTextSize:
                int SetTextSize = ((SeekBar)findViewById(R.id.sk_SetTextSize)).getProgress();
                    listener.onSetTextSize(SetTextSize);
                break;

            case R.id.btn_scaleBoard:
                int scaleBoard = ((SeekBar)findViewById(R.id.sk_scaleBoard)).getProgress();
                listener.onScale(scaleBoard);
                break;

            case R.id.board_16_9:
            case R.id.board_4_3:
            {
                boolean ischeck = ((RadioButton)v).isChecked();
                if (ischeck) {
                    String ration  = ((RadioButton) v).getText().toString();
                    listener.onSetRatio(ration);
                }
            }
                break;

            case R.id.btn_fitMode: {
                int pos_sp_fitMode = ((Spinner) findViewById(R.id.sp_fitMode)).getSelectedItemPosition();
                if (pos_sp_fitMode < FitMode.length) {
                    int type = FitMode[pos_sp_fitMode].type;
                    listener.onSetFitMode(type);
                }
            }
                break;

            case R.id.btn_undo:
                listener.onUndo();
                break;

            case R.id.btn_redo:
                listener.onRedo();
                break;

            case R.id.btn_clear:
                listener.onClear();
                break;

            case R.id.btn_reset:
                listener.onReset();
                break;

            case R.id.btn_setBrushColor:
                int pos1 = ((Spinner)findViewById(R.id.sp_setBrushColor)).getSelectedItemPosition();
                if (pos1 < ColorMap.length) {
                    int type = ColorMap[pos1].type;
                    listener.onSetBrushColor(type);
                }
                break;

            case R.id.btn_setTextColor:
                int pos2 = ((Spinner)findViewById(R.id.sp_setTextColor)).getSelectedItemPosition();
                if (pos2 < ColorMap.length) {
                    int type = ColorMap[pos2].type;
                    listener.onSetTextColor(type);
                }
                break;

            case R.id.btn_setTextStyle:
                int postext = ((Spinner)findViewById(R.id.sp_setTextStyle)).getSelectedItemPosition();
                if (postext < TextStyle.length) {
                    int type = TextStyle[postext].type;
                    listener.onSetTextStyle(type);
                }
                break;

            case R.id.btn_setBackgroundColor:
                int pos3 = ((Spinner)findViewById(R.id.sp_setBackgroundColor)).getSelectedItemPosition();
                if (pos3 < ColorMap.length) {
                    int type = ColorMap[pos3].type;
                    listener.onSetBackgroundColore(type);
                }
                break;

            case R.id.btn_setBackgroundImage:
                Object pos4 = ((Spinner)findViewById(R.id.sp_setBackgroundImage)).getSelectedItem();
                if (pos4 != null && pos4 instanceof String) {
                    final String path = "file:///android_asset/img/" + (String)pos4;
                    listener.onSetBackgroundImage(path);
                }
                break;

            case R.id.btn_setBackgroundH5:
                int pos_h5bk = ((Spinner)findViewById(R.id.sp_setBackgroundH5)).getSelectedItemPosition();
                if (pos_h5bk < H5_BK_URL.length) {
                    final String path = H5_BK_URL[pos_h5bk].key;
                    listener.onSetBackgroundH5(path);
                }
                break;


            //Board(白板)
            case R.id.btn_prevBoard:
                listener.onPrevBoard();
                break;

            case R.id.btn_nextBoard:
                listener.onNextBoard();
                break;

            case R.id.btn_prevStep:
                listener.onPrevStep();
                break;

            case R.id.btn_nextStep:
                listener.onNextStep();
                break;

            case R.id.btn_addBoard:
                String boardid0 = "Test_" + ((int)(Math.random() *1000));
                listener.onAddBoard(boardid0);
                break;

            case R.id.btn_deleteBoard:
                {
                    Spinner deleteboard  = findViewById(R.id.sp_deleteBoard);

                    Object objdeleteboard = deleteboard.getSelectedItem();
                    if (objdeleteboard != null && objdeleteboard instanceof String) {
                        String boardid = (String) objdeleteboard;
                        listener.onDeleteBoard(boardid);
//                        boardArray.remove(boardid);
                    }
                }
                break;

            case R.id.btn_gotoBoard:
                Object objgotoboard = ((Spinner)findViewById(R.id.sp_gotoBoard)).getSelectedItem();
                if (objgotoboard != null && objgotoboard instanceof String) {
                    listener.onGotoBoard((String) objgotoboard);
                }
                break;

            //Board(文件)
            case R.id.btn_addFile:
                int pos5 = ((Spinner)findViewById(R.id.sp_addFile)).getSelectedItemPosition();
                if (pos5 >= 0 && pos5 < H5_PPT_URL.length) {
                    TEduBoardController.TEduBoardTranscodeFileResult result = H5_PPT_URL[pos5];
                    listener.onTransCodeFile(result);
                }
                break;

            case R.id.btn_addH5File:
                int h5File = ((Spinner)findViewById(R.id.sp_addH5File)).getSelectedItemPosition();
                if (h5File >= 0 && h5File < H5_FILE_URL.length) {
                    String url = H5_FILE_URL[h5File].key;
                    listener.onAddH5File(url);
                }
                break;

            case R.id.btn_addImagesFile:
            {
                List<String> urls = Arrays.asList(Images_URL);
                listener.onAddImagesFile(urls);
            }

                break;

            case R.id.btn_deleteFile:
                Object objTitle = ((Spinner)findViewById(R.id.sp_deleteFile)).getSelectedItem();
                if (objTitle != null && objTitle instanceof String) {
                    final String title = (String)objTitle;
                    for (TEduBoardController.TEduBoardFileInfo file : mSettingData.files) {
                        if (title.equals(file.title)) {
                            listener.onDeleteFile(file.fileId);
                            return;
                        }
                    }
                }
                break;

            case R.id.btn_switchFile:
                Object pos7 = ((Spinner)findViewById(R.id.sp_switchFile)).getSelectedItem();
                if (pos7 != null && pos7 instanceof String) {
                    String title = (String)pos7;

                    for (TEduBoardController.TEduBoardFileInfo file : mSettingData.files) {
                        if (title.equals(file.title)) {
                            listener.onGotoFile(file.fileId);
                            return;
                        }
                    }

                    Toast.makeText(getContext(), "file is not exist.", Toast.LENGTH_LONG);
                }
                break;

            case R.id.btn_addVideoFile:
                int pos8 = ((Spinner)findViewById(R.id.sp_addVideoFile)).getSelectedItemPosition();
                if (pos8>=0 && pos8 < VideoRes_URL.length) {
                    final String path = VideoRes_URL[pos8].key;
                    listener.onPlayVideoFile(path);
                }
                break;


            case R.id.btn_video_ctrl_enalbe:
                boolean video_ctrl_enalbe = ((CheckBox)v).isChecked();
                listener.onShowVideoCtrl(video_ctrl_enalbe);
                break;

        }
    }

}
