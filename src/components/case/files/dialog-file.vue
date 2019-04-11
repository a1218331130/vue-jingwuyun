<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" v-if="data!==null" :title="'文件预览-'+data.name+'['+data.type+']'" :modal-append-to-body="true" :append-to-body="true" size="bigest" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row v-if="this.data.type === 'word'">
    <el-col :span="24">

      <div class=Section1 style='layout-grid:15.6pt'>

        <p class=MsoTitle>
          <h2 style="text-align:center;">示例文档标题</h2></p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <o:p>&nbsp;</o:p>
          </span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <span style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp; </span>
          </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <o:p>&nbsp;</o:p>
          </span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <span style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp; </span>
          </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>,</span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <o:p>&nbsp;</o:p>
          </span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:-21.0pt;
        mso-char-indent-count:0;mso-list:l1 level1 lfo1'>
          <![if !supportLists]>
          <span lang=EN-US style='font-family:Wingdings;mso-fareast-font-family:Wingdings;
        mso-bidi-font-family:Wingdings'>
            <span style='mso-list:Ignore'>l
              <span style='font:7.0pt "Times New Roman"'>&nbsp; </span>
            </span>
          </span>
          <![endif]>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>示例点内容</span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:-21.0pt;
        mso-char-indent-count:0;mso-list:l1 level1 lfo1'>
          <![if !supportLists]>
          <span lang=EN-US style='font-family:Wingdings;mso-fareast-font-family:Wingdings;
        mso-bidi-font-family:Wingdings'>
            <span style='mso-list:Ignore'>l
              <span style='font:7.0pt "Times New Roman"'>&nbsp; </span>
            </span>
          </span>
          <![endif]>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>示例点内容</span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:-21.0pt;
        mso-char-indent-count:0;mso-list:l1 level1 lfo1'>
          <![if !supportLists]>
          <span lang=EN-US style='font-family:Wingdings;mso-fareast-font-family:Wingdings;
        mso-bidi-font-family:Wingdings'>
            <span style='mso-list:Ignore'>l
              <span style='font:7.0pt "Times New Roman"'>&nbsp; </span>
            </span>
          </span>
          <![endif]>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>示例点内容</span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:0cm;mso-char-indent-count:
        0'>
          <span lang=EN-US>
            <o:p>&nbsp;</o:p>
          </span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:-21.0pt;
        mso-char-indent-count:0;mso-list:l0 level1 lfo2'>
          <![if !supportLists]>
          <span lang=EN-US style='mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;
        mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'>
            <span style='mso-list:Ignore'>1.
              <span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </span>
          <![endif]>
          <span style='font-family:宋体;mso-ascii-font-family:
        Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font:
        minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin'>序列点内容</span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:-21.0pt;
        mso-char-indent-count:0;mso-list:l0 level1 lfo2'>
          <![if !supportLists]>
          <span lang=EN-US style='mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;
        mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'>
            <span style='mso-list:Ignore'>2.
              <span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </span>
          <![endif]>
          <span style='font-family:宋体;mso-ascii-font-family:
        Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font:
        minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin'>序列点内容</span>
        </p>

        <p class=MsoListParagraph style='margin-left:21.0pt;text-indent:-21.0pt;
        mso-char-indent-count:0;mso-list:l0 level1 lfo2'>
          <![if !supportLists]>
          <span lang=EN-US style='mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;
        mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'>
            <span style='mso-list:Ignore'>3.
              <span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </span>
          <![endif]>
          <span style='font-family:宋体;mso-ascii-font-family:
        Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font:
        minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin'>序列点内容</span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <o:p>&nbsp;</o:p>
          </span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <span style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp; </span>
          </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                  mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                  Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>,</span>
        </p>
        <p class=MsoNormal>
          <span lang=EN-US>
            <span style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp; </span>
          </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
                          mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
                          Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>,</span>
        </p>
        <p class=MsoNormal>
          <span lang=EN-US>
            <span style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp; </span>
          </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>, </span>
          <span style='font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;
        mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:
        Calibri;mso-hansi-theme-font:minor-latin'>正文内容</span>
          <span lang=EN-US>,</span>
        </p>

        <p class=MsoNormal>
          <span lang=EN-US>
            <o:p>&nbsp;</o:p>
          </span>
        </p>

      </div>
    </el-col>
  </el-row>
  <el-row v-if="this.data.type === 'excel'">
    <el-col :span="24">
      <el-table @cell-mouse-enter="cellMouseEnter" :data="list">
        <el-table-column label="序号" prop="id" width="45"></el-table-column>
        <el-table-column label="关键字" prop="keyword"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="日期" prop="date"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-row v-if="this.data.type === 'text'">
    <el-col :span="24">
      <p>示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容.</p>
      <p>示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容,
        示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容.</p>
      <p>示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容, 示例文本文件内容.</p>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">关闭</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
p {
    font-size: 16px;
    line-height: 32px;
}
</style>

<script>
import mixin from '../../../utils/mixin'
export default {
  mixins: [mixin],
  props: ['dialog', 'data'],
  data() {
    return {
      content: null,
      list: [{
        id: 1,
        keyword: '441424198601030022',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 2,
        keyword: '张晓',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 3,
        keyword: '刘房泰',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 4,
        keyword: '13726279778',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 5,
        keyword: '李娜娜',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 6,
        keyword: '杨少纯',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 7,
        keyword: '邱阳',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 8,
        keyword: '邱少阳',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 9,
        keyword: '13609786578',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }, {
        id: 10,
        keyword: '14367679012',
        ip: '10.142.64.172',
        date: '2017/8/11 12:30:47'
      }]
    }
  },
  computed: {},
  methods: {
    initDialog() {

    },
    closeEvent() {
      this.$emit('close')
    }
  },
  created() {

  },
  mounted() {}
}
</script>
