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
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.tencent.teduboard.TEduBoardController;
import com.tencent.tic.demo.R;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class TICMenuDialog extends Dialog implements View.OnClickListener {

    private final static String TAG = "TICMenuDialog";
    final static String LOCAL_FILE = "local:";
    private boolean isNextTextFocusable;

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

    private final static String[] Images_URL = {
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
    private final static TEduBoardController.TEduBoardTranscodeFileResult H5_PPT_URL[] = {
            new TEduBoardController.TEduBoardTranscodeFileResult("欢迎新同学", "https://ppt2h5-1259648581.file.myqcloud.com/ghikv1979vq1bhl3jtpb/index.html", 23, "960x540"),
            //    new TEduBoardController.TEduBoardTranscodeFileResult("cos转码", "https://testci-1257307760.cos.ap-guangzhou.myqcloud.com/%E6%AC%A2%E8%BF%8E%E6%96%B0%E5%90%8C%E5%AD%A6%20-%20%E5%BA%8F%E5%8F%B7.ppt?for_tiw=1"),
            new TEduBoardController.TEduBoardTranscodeFileResult("腾讯课堂介绍", "https://transcode-result-1259648581.file.myqcloud.com/g6lcd5qcpqrgit7mopob/", 9, "1766x987")
    };

    //H5背景
    private final static KValue[] H5_BK_URL = {
            new KValue("https://cloud.tencent.com/product/tiw", "白板"),
            new KValue("https://cloud.tencent.com/solution/tic", "在线课堂"),
    };

    //H5文件
    private final static KValue[] H5_FILE_URL = {
            new KValue("https://cloud.tencent.com/", "腾讯云"),
    };

    //Video
    private final static KValue[] VideoRes_URL = {
            new KValue("https://tic-res-1259648581.cos.ap-shanghai.myqcloud.com/demo/tiw-vod.mp4", "腾讯教育")
    };

    //白板元素
    private final static KValue[] ELEMENT_URL = {
            new KValue("图片", "https://main.qcloudimg.com/raw/be5d8bc407204d0e1dea30bacd6d006b.png"),
            new KValue("h5", "https://www.qq.com"),
            new KValue("自定义图形", "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E4%B8%89%E8%A7%92%E5%BD%A2.svg"),
            new KValue("音频", "https://eric-test-1259648581.cos.ap-guangzhou.myqcloud.com/test.mp3")
    };

    final ToolType[] mToolMap = {
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
            new ToolType("手势缩放", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ZOOM_DRAG),
            new ToolType("空心正方形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_SQUARE),
            new ToolType("实心正方形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_SQUARE_SOLID),
            new ToolType("空心正圆形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CIRCLE),
            new ToolType("实心正圆形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CIRCLE_SOLID),
            new ToolType("自定义图形", TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_BOARD_CUSTOM_GRAPH)

    };

    final ToolType[] ColorMap = {
            new ToolType("白", 0xFFFFFFFF),
            new ToolType("红", 0xFFFF0000),
            new ToolType("橙", 0xFFFFA500),
            new ToolType("黄", 0xFFFFFF00),
            new ToolType("绿", 0xFF00FF00),
            new ToolType("青", 0xFF00FFFF),
            new ToolType("蓝", 0xFF0000ff),
            new ToolType("紫", 0xFF800080),
    };

    final ToolType[] TextStyle = {
            new ToolType("常规", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_NORMAL),
            new ToolType("粗体", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_BOLD),
            new ToolType("斜体", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_ITALIC),
            new ToolType("粗斜体", TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_BOLD_ITALIC),
    };

    final ToolType[] FitMode = {
            new ToolType("默认模式", TEduBoardController.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_NONE),
            new ToolType("填满白板", TEduBoardController.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_CENTER_INSIDE),
            new ToolType("填满容器", TEduBoardController.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_CENTER_COVER),
    };

    final ToolType[] WipeStyle = {
            new ToolType("LINE", TEduBoardController.TEduBoardErasableElementType.LINE),
            new ToolType("GRAPH", TEduBoardController.TEduBoardErasableElementType.GRAPH),
            new ToolType("TEXT", TEduBoardController.TEduBoardErasableElementType.TEXT),
            new ToolType("IMAGE", TEduBoardController.TEduBoardErasableElementType.IMAGE),
            new ToolType("ELEMENT", TEduBoardController.TEduBoardErasableElementType.ELEMENT)
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

        void onStartSnapshot();

        void onNextTextInput(String textContent, boolean keepFocus);

        void onTipTextInput(String textContent);

        void onWipeNumInput(int num);

        void onSetHandwritingEnable(boolean syncDrawEnable);

        void onSetSystemCursorEnable(boolean systemCursorEnable);

        void onSetToolType(int type);

        void onBrushThin(int size);

        void onSetTextSize(int size);

        void onScale(int scale);

        void onSetRatio(String scale);

        void onSetFitMode(int mode);

        void onAddElement(int type, String url);

        void onSetBrushColor(int color);

        void onSetTextColor(int color);

        void onSetTextStyle(int style);

        void onSetBackgroundColore(int color);

        void onSetBackgroundImage(String path);

        void onSetBackgroundH5(String url);

        void setWipeType(int wipeType);

        void onSetNickNameVisiable(boolean visiable);

        void onUndo();

        void onRedo();

        void onClear();

        void onReset();

        //Board(白板操作)
        void onAddBoard(String url);

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

        void onSyncAndReload();

        void onPlayAudio();

        void onPauseAudio();


        void onAddBackupDomain();

        void onRemoveBackupDomain();

        //分组操作  
        void onAddBoardToClassGroup(String groupId, String boardId);

        void onAddUserToClassGroup(String groupId,String userId);

        void onGetAllClassGroupIds();

        void onGetClassGroupEnable();

        void onGetClassGroupIdByUserId(String userId);

        void onGetClassGroupInfoByGroupId(String groupId);

        void onGotoClassGroupBoard(String boardId);

        void onRemoveBoardInClassGroup(String groupId,String boardId);

        void onRemoveClassGroup(String groupId);

        void onRemoveUserInClassGroup(String groupId,String userId);

        void onResetClassGroup();

        void onSetClassGroup(String groupId,List<String> boards,List<String> users,String title,String currentBoardId);

        void onSetClassGroupEnable(boolean enable);

        void onSetClassGroupTitle(String groupId,String title);

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
        boolean isNickNameVisiable = true;
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
    }

    ;


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

        //---------Board(涂鸭)---------
        CheckBox board_nextTextFocusable = findViewById(R.id.board_setNextTextFocusable);
        board_nextTextFocusable.setOnClickListener(this);
        //   board_nextTextFocusable.setChecked(false);

        CheckBox board_isDrawEnable = findViewById(R.id.board_setDrawEnable);
        board_isDrawEnable.setOnClickListener(this);
        board_isDrawEnable.setChecked(settingData.isDrawEnable);

        CheckBox board_isSycDrawEnable = findViewById(R.id.board_SynDrawEnable);
        board_isSycDrawEnable.setOnClickListener(this);
        board_isSycDrawEnable.setChecked(settingData.isSynDrawEnable);


        Button boardSnapshotBtn = (Button) findViewById(R.id.board_snapshot);
        boardSnapshotBtn.setOnClickListener(this);

        Button boardNextTextBtn = (Button) findViewById(R.id.board_nextText);
        boardNextTextBtn.setOnClickListener(this);

        Button boardTipTextBtn = (Button) findViewById(R.id.board_tipText);
        boardTipTextBtn.setOnClickListener(this);

        Button boardWipeTextBtn = (Button) findViewById(R.id.board_wipeText);
        boardWipeTextBtn.setOnClickListener(this);

        CheckBox HandwritingEnable = findViewById(R.id.board_setHandwritingEnable);
        HandwritingEnable.setOnClickListener(this);
        HandwritingEnable.setChecked(settingData.isHandwritingEnable);

        RadioButton mRbCursorEnable = (RadioButton) findViewById(R.id.cursor_yes);
        mRbCursorEnable.setOnClickListener(this);

        RadioButton mRbCursorNoEnable = (RadioButton) findViewById(R.id.cursor_no);
        mRbCursorNoEnable.setOnClickListener(this);

        int posToolType = 0;
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < mToolMap.length; i++) {
            adapter.add(mToolMap[i].name);
            if (settingData.ToolType == mToolMap[i].type) {
                posToolType = i;
            }
        }
        Spinner spToolType = (Spinner) findViewById(R.id.sp_SetToolType);
        spToolType.setAdapter(adapter);
        spToolType.setSelection(posToolType, false);
        findViewById(R.id.btn_SetToolType).setOnClickListener(this);


        findViewById(R.id.btn_BrushThin).setOnClickListener(this);
        ((TextView) findViewById(R.id.tv_BrushThin)).setText(String.valueOf(settingData.BrushThin));
        SeekBar sbVideoBitrate = findViewById(R.id.sk_BrushThin);
        sbVideoBitrate.setProgress(settingData.BrushThin);
        sbVideoBitrate.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ((TextView) findViewById(R.id.tv_BrushThin)).setText(String.valueOf(progress));
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });

        findViewById(R.id.btn_SetTextSize).setOnClickListener(this);
        ((TextView) findViewById(R.id.tv_SetTextSize)).setText(String.valueOf(settingData.TextSize));
        SeekBar sk_TextSize = (SeekBar) findViewById(R.id.sk_SetTextSize);
        sk_TextSize.setProgress(settingData.TextSize);
        sk_TextSize.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ((TextView) findViewById(R.id.tv_SetTextSize)).setText(String.valueOf(progress));
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });

        //缩放
        findViewById(R.id.btn_scaleBoard).setOnClickListener(this);
        ((TextView) findViewById(R.id.tv_scaleBoard)).setText(String.valueOf(settingData.ScaleSize));
        SeekBar sk_scaleBoard = (SeekBar) findViewById(R.id.sk_scaleBoard);
        sk_scaleBoard.setProgress(settingData.ScaleSize);
        sk_scaleBoard.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ((TextView) findViewById(R.id.tv_scaleBoard)).setText(String.valueOf(progress));
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });

        //宽高比
        RadioButton mRbBoardRation169 = (RadioButton) findViewById(R.id.board_16_9);
        String ratio169 = mRbBoardRation169.getText().toString();
        mRbBoardRation169.setOnClickListener(this);
        mRbBoardRation169.setChecked(!TextUtils.isEmpty(ratio169) && ratio169.equals(settingData.ration));

        RadioButton mRbBoardRation43 = (RadioButton) findViewById(R.id.board_4_3);
        String ratio43 = mRbBoardRation43.getText().toString();
        mRbBoardRation43.setOnClickListener(this);
        mRbBoardRation43.setChecked(!TextUtils.isEmpty(ratio43) && ratio43.equals(settingData.ration));


        //填充模式
        int fitModeType = 0;
        ArrayAdapter<String> fitMode_adapter = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < FitMode.length; i++) {
            fitMode_adapter.add(FitMode[i].name);
            if (settingData.FitMode == FitMode[i].type) {
                fitModeType = i;
            }
        }
        Spinner spFitMode = (Spinner) findViewById(R.id.sp_fitMode);
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

        ArrayAdapter<String> elements = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < ELEMENT_URL.length; i++) {
            elements.add(ELEMENT_URL[i].key);
        }
        Spinner spElementColor = (Spinner) findViewById(R.id.sp_addElement);
        spElementColor.setAdapter(elements);
        spElementColor.setSelection(0, false);
        findViewById(R.id.btn_addElement).setOnClickListener(this);

        int pos_brushcolor = 0;
        int pos_textcolor = 0;
        int pos_backgroundcolor = 0;
        ArrayAdapter<String> colors = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
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
        Spinner spBruchColor = (Spinner) findViewById(R.id.sp_setBrushColor);
        spBruchColor.setAdapter(colors);
        spBruchColor.setSelection(pos_brushcolor, false);
        findViewById(R.id.btn_setBrushColor).setOnClickListener(this);

        Spinner spTextColor = (Spinner) findViewById(R.id.sp_setTextColor);
        spTextColor.setAdapter(colors);
        spTextColor.setSelection(pos_textcolor, false);
        findViewById(R.id.btn_setTextColor).setOnClickListener(this);

        int pos_textstyle = 0;
        ArrayAdapter<String> textstyle = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < TextStyle.length; i++) {
            textstyle.add(TextStyle[i].name);
            if (TextStyle[i].type == settingData.TextStyle) {
                pos_textstyle = i;
            }
        }

        Spinner spTextStyle = (Spinner) findViewById(R.id.sp_setTextStyle);
        spTextStyle.setAdapter(textstyle);
        spTextStyle.setSelection(pos_textstyle, false);
        findViewById(R.id.btn_setTextStyle).setOnClickListener(this);

        Spinner spbackgroundColor = (Spinner) findViewById(R.id.sp_setBackgroundColor);
        spbackgroundColor.setAdapter(colors);
        spbackgroundColor.setSelection(pos_backgroundcolor, false);
        findViewById(R.id.btn_setBackgroundColor).setOnClickListener(this);

        ArrayAdapter<String> imgArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
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
        Spinner backimage = (Spinner) findViewById(R.id.sp_setBackgroundImage);
        backimage.setAdapter(imgArray);
        backimage.setSelection(0, false);
        findViewById(R.id.btn_setBackgroundImage).setOnClickListener(this);


        ArrayAdapter<String> bgh5Array = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < H5_BK_URL.length; i++) {
            bgh5Array.add(H5_BK_URL[i].value);
        }
        Spinner bgh5 = (Spinner) findViewById(R.id.sp_setBackgroundH5);
        bgh5.setAdapter(bgh5Array);
        bgh5.setSelection(0, false);
        findViewById(R.id.btn_setBackgroundH5).setOnClickListener(this);


        ArrayAdapter<String> wipeTypeArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < WipeStyle.length; i++) {
            wipeTypeArray.add(WipeStyle[i].name);
        }
        Spinner wipeSp = (Spinner) findViewById(R.id.sp_set_wipe_type);
        wipeSp.setAdapter(wipeTypeArray);
        wipeSp.setSelection(0, false);
        findViewById(R.id.btn_set_wipe_type).setOnClickListener(this);

        CheckBox board_isNickNameVisiable = findViewById(R.id.board_setNickNameVisiable);
        board_isNickNameVisiable.setOnClickListener(this);
        board_isNickNameVisiable.setChecked(settingData.isNickNameVisiable);

        //---------Board(白板)---------
        findViewById(R.id.btn_prevBoard).setOnClickListener(this);
        findViewById(R.id.btn_nextBoard).setOnClickListener(this);

        findViewById(R.id.btn_prevStep).setOnClickListener(this);
        findViewById(R.id.btn_nextStep).setOnClickListener(this);


        findViewById(R.id.btn_addBoard).setOnClickListener(this);
        findViewById(R.id.btn_deleteBoard).setOnClickListener(this);
        findViewById(R.id.btn_gotoBoard).setOnClickListener(this);

        findViewById(R.id.board_audio_play).setOnClickListener(this);
        findViewById(R.id.board_audio_pause).setOnClickListener(this);

        int pos = 0;
        boardArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        if (settingData.boardIds != null && settingData.boardIds.size() > 0) {
            if (!TextUtils.isEmpty(mSettingData.currentBoardId)) {
                pos = settingData.boardIds.indexOf(mSettingData.currentBoardId);
            }

            boardArray.addAll(settingData.boardIds);
        }
        Spinner deleteboard = (Spinner) findViewById(R.id.sp_deleteBoard);
        deleteboard.setAdapter(boardArray);
        deleteboard.setSelection(pos >= 0 ? pos : 0, false);

        Spinner gotoboard = (Spinner) findViewById(R.id.sp_gotoBoard);
        gotoboard.setAdapter(boardArray);
        gotoboard.setSelection(pos >= 0 ? pos : 0, false);


        //---------Board(文件)---------
        findViewById(R.id.btn_addFile).setOnClickListener(this);
        findViewById(R.id.btn_deleteFile).setOnClickListener(this);
        findViewById(R.id.btn_switchFile).setOnClickListener(this);
        findViewById(R.id.btn_addImagesFile).setOnClickListener(this);
        findViewById(R.id.btn_addH5File).setOnClickListener(this);

        ArrayAdapter<String> pptArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (TEduBoardController.TEduBoardTranscodeFileResult file : H5_PPT_URL) {
            pptArray.add(file.title);
        }
        Spinner sp_addFile = (Spinner) findViewById(R.id.sp_addFile);
        sp_addFile.setAdapter(pptArray);

        int pos_file = 0;
        ArrayAdapter<String> filesArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        if (settingData.files != null) {
            int i = 0;
            for (TEduBoardController.TEduBoardFileInfo info : settingData.files) {
                filesArray.add(TextUtils.isEmpty(info.title) ? info.fileId : info.title);
                if (info.fileId.equals(mSettingData.currentFileId)) {
                    pos_file = i;
                }
                i++;
            }
        }

        //H5文件
        ArrayAdapter<String> H5FileArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < H5_FILE_URL.length; i++) {
            H5FileArray.add(H5_FILE_URL[i].value);
        }
        Spinner H5FileSp = (Spinner) findViewById(R.id.sp_addH5File);
        H5FileSp.setAdapter(H5FileArray);
        H5FileSp.setSelection(0, false);


        Spinner deletefile = (Spinner) findViewById(R.id.sp_deleteFile);
        deletefile.setAdapter(filesArray);
        deletefile.setSelection(pos_file >= 0 ? pos_file : 0, false);

        Spinner switchfile = (Spinner) findViewById(R.id.sp_switchFile);
        switchfile.setAdapter(filesArray);
        switchfile.setSelection(pos_file >= 0 ? pos_file : 0, false);


        //---------视频(video)---------
        findViewById(R.id.btn_addVideoFile).setOnClickListener(this);
        findViewById(R.id.btn_video_ctrl_enalbe).setOnClickListener(this);

        ArrayAdapter<String> videoArray = new ArrayAdapter<String>(this.getContext(), android.R.layout.simple_spinner_item, android.R.id.text1);
        for (int i = 0; i < VideoRes_URL.length; i++) {
            videoArray.add(VideoRes_URL[i].value);
        }
        Spinner videoSp = (Spinner) findViewById(R.id.sp_addVideoFile);
        videoSp.setAdapter(videoArray);
        videoSp.setSelection(0, false);

        findViewById(R.id.btn_reload).setOnClickListener(this);

        findViewById(R.id.btn_add_domain).setOnClickListener(this);

        findViewById(R.id.btn_remove_domain).setOnClickListener(this);


        findViewById(R.id.btn_addtoclassgroup).setOnClickListener(this);

        findViewById(R.id.btn_addusertoclassgroup).setOnClickListener(this);

        findViewById(R.id.btn_getallclassgroupids).setOnClickListener(this);

        findViewById(R.id.btn_getclassgroupenable).setOnClickListener(this);

        findViewById(R.id.btn_getclassgroupbyuserid).setOnClickListener(this);

        findViewById(R.id.btn_getClassGroupInfoByGroupId).setOnClickListener(this);

        findViewById(R.id.btn_gotoClassGroupBoard).setOnClickListener(this);

        findViewById(R.id.btn_removeBoardInClassGroup).setOnClickListener(this);

        findViewById(R.id.btn_removeClassGroup).setOnClickListener(this);

        findViewById(R.id.btn_removeUserInClassGroup).setOnClickListener(this);

        findViewById(R.id.btn_resetClassGroup).setOnClickListener(this);

        findViewById(R.id.btn_setClassGroup).setOnClickListener(this);

        findViewById(R.id.btn_setClassGroupEnable).setOnClickListener(this);

        findViewById(R.id.btn_setClassGroupTitle).setOnClickListener(this);

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

            //Board(涂鸭)
            case R.id.board_setNextTextFocusable:
                isNextTextFocusable = ((CheckBox) v).isChecked();
                break;
            case R.id.board_nextText:
                String textContent = ((EditText) findViewById(R.id.et_next)).getText().toString();
                listener.onNextTextInput(textContent, isNextTextFocusable);
                break;
            case R.id.board_tipText:
                String tipContent = ((EditText) findViewById(R.id.et_tip)).getText().toString();
                listener.onTipTextInput(tipContent);
                break;
            case R.id.board_wipeText:
                String wipeContent = ((EditText) findViewById(R.id.et_wipe)).getText().toString();
                listener.onWipeNumInput(Integer.parseInt(wipeContent));
                break;
            case R.id.board_setDrawEnable:
                boolean setDrawEnable = ((CheckBox) v).isChecked();
                listener.onSetDrawEnable(setDrawEnable);
                break;

            case  R.id.board_setNickNameVisiable:
                boolean nickNameVisiable = ((CheckBox) v).isChecked();
                listener.onSetNickNameVisiable(nickNameVisiable);
                break;

            case R.id.board_SynDrawEnable:
                boolean syncDrawEnable = ((CheckBox) v).isChecked();
                listener.onSyncDrawEnable(syncDrawEnable);
                break;
            case R.id.board_snapshot:
                listener.onStartSnapshot();
                break;
            case R.id.board_setHandwritingEnable:
                boolean setHandwritingEnable = ((CheckBox) v).isChecked();
                listener.onSetHandwritingEnable(setHandwritingEnable);
                break;
            case R.id.cursor_yes:
                listener.onSetSystemCursorEnable(true);
                break;
            case R.id.cursor_no:
                listener.onSetSystemCursorEnable(false);
                break;
            case R.id.btn_SetToolType:
                int pos = ((Spinner) findViewById(R.id.sp_SetToolType)).getSelectedItemPosition();
                if (pos < mToolMap.length) {
                    int type = mToolMap[pos].type;
                    listener.onSetToolType(type);
                }
                break;

            case R.id.btn_BrushThin:
                int BrushThin = ((SeekBar) findViewById(R.id.sk_BrushThin)).getProgress();
                listener.onBrushThin(BrushThin);
                break;

            case R.id.btn_SetTextSize:
                int SetTextSize = ((SeekBar) findViewById(R.id.sk_SetTextSize)).getProgress();
                listener.onSetTextSize(SetTextSize);
                break;

            case R.id.btn_scaleBoard:
                int scaleBoard = ((SeekBar) findViewById(R.id.sk_scaleBoard)).getProgress();
                listener.onScale(scaleBoard);
                break;

            case R.id.board_16_9:
            case R.id.board_4_3: {
                boolean ischeck = ((RadioButton) v).isChecked();
                if (ischeck) {
                    String ration = ((RadioButton) v).getText().toString();
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
            case R.id.btn_addElement:
                int pose = ((Spinner) findViewById(R.id.sp_addElement)).getSelectedItemPosition();
                if (pose < ELEMENT_URL.length) {
                    String value = ELEMENT_URL[pose].value;
                    listener.onAddElement(pose + 1, value);
                }
                break;
            case R.id.btn_setBrushColor:
                int pos1 = ((Spinner) findViewById(R.id.sp_setBrushColor)).getSelectedItemPosition();
                if (pos1 < ColorMap.length) {
                    int type = ColorMap[pos1].type;
                    listener.onSetBrushColor(type);
                }
                break;

            case R.id.btn_setTextColor:
                int pos2 = ((Spinner) findViewById(R.id.sp_setTextColor)).getSelectedItemPosition();
                if (pos2 < ColorMap.length) {
                    int type = ColorMap[pos2].type;
                    listener.onSetTextColor(type);
                }
                break;

            case R.id.btn_setTextStyle:
                int postext = ((Spinner) findViewById(R.id.sp_setTextStyle)).getSelectedItemPosition();
                if (postext < TextStyle.length) {
                    int type = TextStyle[postext].type;
                    listener.onSetTextStyle(type);
                }
                break;

            case R.id.btn_setBackgroundColor:
                int pos3 = ((Spinner) findViewById(R.id.sp_setBackgroundColor)).getSelectedItemPosition();
                if (pos3 < ColorMap.length) {
                    int type = ColorMap[pos3].type;
                    listener.onSetBackgroundColore(type);
                }
                break;

            case R.id.btn_setBackgroundImage:
                Object pos4 = ((Spinner) findViewById(R.id.sp_setBackgroundImage)).getSelectedItem();
                if (pos4 != null && pos4 instanceof String) {
                    final String path = "file:///android_asset/img/" + (String) pos4;
                    listener.onSetBackgroundImage(path);
                }
                break;
            case R.id.btn_set_wipe_type:
                int wipePos = ((Spinner) findViewById(R.id.sp_set_wipe_type)).getSelectedItemPosition();
                if (wipePos < WipeStyle.length) {
                    int type = WipeStyle[wipePos].type;
                    listener.setWipeType(type);
                }
                break;
            case R.id.btn_setBackgroundH5:
                int pos_h5bk = ((Spinner) findViewById(R.id.sp_setBackgroundH5)).getSelectedItemPosition();
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
                listener.onAddBoard(null);
                break;

            case R.id.btn_deleteBoard: {
                Spinner deleteboard = findViewById(R.id.sp_deleteBoard);

                Object objdeleteboard = deleteboard.getSelectedItem();
                if (objdeleteboard != null && objdeleteboard instanceof String) {
                    String boardid = (String) objdeleteboard;
                    listener.onDeleteBoard(boardid);
//                        boardArray.remove(boardid);
                }
            }
            break;

            case R.id.btn_gotoBoard:
                Object objgotoboard = ((Spinner) findViewById(R.id.sp_gotoBoard)).getSelectedItem();
                if (objgotoboard != null && objgotoboard instanceof String) {
                    listener.onGotoBoard((String) objgotoboard);
                }
                break;

            //Board(文件)
            case R.id.btn_addFile:
                int pos5 = ((Spinner) findViewById(R.id.sp_addFile)).getSelectedItemPosition();
                if (pos5 >= 0 && pos5 < H5_PPT_URL.length) {
                    TEduBoardController.TEduBoardTranscodeFileResult result = H5_PPT_URL[pos5];
                    listener.onTransCodeFile(result);
                }
                break;

            case R.id.btn_addH5File:
                int h5File = ((Spinner) findViewById(R.id.sp_addH5File)).getSelectedItemPosition();
                if (h5File >= 0 && h5File < H5_FILE_URL.length) {
                    String url = H5_FILE_URL[h5File].key;
                    listener.onAddH5File(url);
                }
                break;

            case R.id.btn_addImagesFile: {
                List<String> urls = Arrays.asList(Images_URL);
                listener.onAddImagesFile(urls);
            }

            break;

            case R.id.btn_deleteFile:
                Object objTitle = ((Spinner) findViewById(R.id.sp_deleteFile)).getSelectedItem();
                if (objTitle != null && objTitle instanceof String) {
                    final String title = (String) objTitle;
                    for (TEduBoardController.TEduBoardFileInfo file : mSettingData.files) {
                        if (title.equals(file.title)) {
                            listener.onDeleteFile(file.fileId);
                            return;
                        }
                    }
                }
                break;

            case R.id.btn_switchFile:
                Object pos7 = ((Spinner) findViewById(R.id.sp_switchFile)).getSelectedItem();
                if (pos7 != null && pos7 instanceof String) {
                    String title = (String) pos7;

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
                int pos8 = ((Spinner) findViewById(R.id.sp_addVideoFile)).getSelectedItemPosition();
                if (pos8 >= 0 && pos8 < VideoRes_URL.length) {
                    final String path = VideoRes_URL[pos8].key;
                    listener.onPlayVideoFile(path);
                }
                break;


            case R.id.btn_video_ctrl_enalbe:
                boolean video_ctrl_enalbe = ((CheckBox) v).isChecked();
                listener.onShowVideoCtrl(video_ctrl_enalbe);
                break;
            case R.id.board_audio_play:
                listener.onPlayAudio();
                break;
            case R.id.board_audio_pause:
                listener.onPauseAudio();
                break;
            case R.id.btn_reload:
                listener.onSyncAndReload();
                break;
            case R.id.btn_add_domain:
                listener.onAddBackupDomain();
                break;
            case R.id.btn_remove_domain:
                listener.onRemoveBackupDomain();
                break;

            case R.id.btn_addtoclassgroup:
                EditText groupEt = findViewById(R.id.et_groupId1);
                EditText userEt = findViewById(R.id.et_userId1);

                String groupId = groupEt.getText().toString();
                String userId = userEt.getText().toString();

                listener.onAddBoardToClassGroup(groupId, userId);

                break;
            case R.id.btn_addusertoclassgroup:

                EditText groupEt2 = findViewById(R.id.et_groupId2);
                EditText userEt2 = findViewById(R.id.et_userId2);

                String groupId2 = groupEt2.getText().toString();
                String userId2 = userEt2.getText().toString();

                listener.onAddUserToClassGroup(groupId2, userId2);

                break;
            case R.id.btn_getallclassgroupids:
                listener.onGetAllClassGroupIds();
                break;
            case R.id.btn_getclassgroupenable:
                listener.onGetClassGroupEnable();
                break;
            case R.id.btn_getclassgroupbyuserid:
                EditText userEt3 = findViewById(R.id.et_userId3);
                String userId3 = userEt3.getText().toString();
                listener.onGetClassGroupIdByUserId(userId3);
                break;
            case R.id.btn_getClassGroupInfoByGroupId:
                EditText groupIdEt4 = findViewById(R.id.et_groupid4);
                String groupId4 = groupIdEt4.getText().toString();
                listener.onGetClassGroupInfoByGroupId(groupId4);
                break;
            case R.id.btn_gotoClassGroupBoard:
                EditText boardIdEt5 = findViewById(R.id.et_boardid4);
                String boardId5 = boardIdEt5.getText().toString();
                listener.onGotoClassGroupBoard(boardId5);
                break;
            case R.id.btn_removeBoardInClassGroup:
                EditText groupIdEt5 = findViewById(R.id.et_groupid5);
                String groupId5 = groupIdEt5.getText().toString();
                EditText boardIdEt6 = findViewById(R.id.et_boardid5);
                String boardId6 = boardIdEt6.getText().toString();

                listener.onRemoveBoardInClassGroup(groupId5, boardId6);
                break;
            case R.id.btn_removeClassGroup:
                EditText groupIdEt6 = findViewById(R.id.et_groupid6);
                String groupId6 = groupIdEt6.getText().toString();

                listener.onRemoveClassGroup(groupId6);
                break;
            case R.id.btn_removeUserInClassGroup:
                EditText groupEt7 = findViewById(R.id.et_groupid7);
                EditText userEt7 = findViewById(R.id.et_userid7);

                String groupId7 = groupEt7.getText().toString();
                String userId7 = userEt7.getText().toString();

                listener.onRemoveUserInClassGroup(groupId7, userId7);
                break;
            case R.id.btn_resetClassGroup:
                listener.onResetClassGroup();
                break;
            case R.id.btn_setClassGroup:
                EditText et_groupid8 = findViewById(R.id.et_groupid8);
                EditText et_boardid8 = findViewById(R.id.et_boardid8);
                EditText et_userid8 = findViewById(R.id.et_userid8);
                EditText et_title8 = findViewById(R.id.et_title8);
                EditText et_currentboardid8 = findViewById(R.id.et_currentboardid8);

                String groupStr = et_groupid8.getText().toString();
                String boardStr = et_boardid8.getText().toString().trim();
                String userStr = et_userid8.getText().toString().trim();
                String titleStr = et_title8.getText().toString();
                String currentboardStr = et_currentboardid8.getText().toString();
                List<String> boardList = new ArrayList<>();
                List<String> userList = new ArrayList<>();
                boardList=Arrays.asList(boardStr.split(","));
                userList =Arrays.asList(userStr.split(","));
                
                listener.onSetClassGroup(groupStr,boardList,userList,titleStr,currentboardStr);
                break;
            case R.id.btn_setClassGroupEnable:
                EditText et_enable9 = findViewById(R.id.et_enable9);
                String enable = et_enable9.getText().toString();
                Boolean isEnable=Boolean.parseBoolean(enable);
                listener.onSetClassGroupEnable(isEnable);
                break;
            case R.id.btn_setClassGroupTitle:
                EditText et_groupid10 = findViewById(R.id.et_groupid10);
                EditText et_title10 = findViewById(R.id.et_title10);

                String group10 = et_groupid10.getText().toString();
                String title10 = et_title10.getText().toString();

                listener.onSetClassGroupTitle(group10, title10);
                break;
        }
    }

}
