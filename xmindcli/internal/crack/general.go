package xmindcrack

import (
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	_ "net/http/pprof"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	goAsarTool "xmindcli/internal/goasar"
)

//go:embed asset/*
var asset embed.FS

var ValidVersion = "24.10.01101"

var (
	XmindExe    string // xmind.exe路径
	asarDir     string // asar所在文件夹目录
	AsarFile    string // asar文件目录
	asarSys     *goAsarTool.SimpleFileSystem
	packageJson map[string]interface{}
)

// Prepare 初始化
func Prepare() error {
	if err := CheckEnv(); err != nil {
		return err
	}
	appAsar := goAsarTool.NewAsarFile(AsarFile)
	err := appAsar.Open()
	if err != nil {
		return err
	}
	asarSys, err = goAsarTool.NewSimpleFileSystemByAsar(appAsar)
	if err != nil {
		return err
	}
	//读取package.json文件
	packageFile, err := asarSys.GetFile("package.json")
	if err != nil {
		return err
	}
	if err = json.Unmarshal(*packageFile.DataBuffer, &packageJson); err != nil {
		return err
	}
	if !isValidVersion(packageJson["version"].(string)) {
		return errors.New("xmind version is lower, please update new version first")
	}
	return nil
}

func isFix() bool {
	return packageJson["main"] == "main/xmind.js"
}

func StartPatch(isOfflineActive bool) error {
	if isOfflineActive {
		// 获取用户主目录
		userHome, err := os.UserHomeDir()
		if err != nil {
			fmt.Printf("获取用户主目录失败: %v\n", err)
			return err
		}
		// 目标文件路径，假设复制到用户主目录下
		destFilePath := filepath.Join(userHome, "xmindOfflineToken")
		srcFileContent, err := fs.ReadFile(asset, "asset/xmindOfflineToken")
		if err != nil {
			fmt.Printf("读取嵌入文件失败: %v\n", err)
			return err
		}
		// 创建目标文件并写入内容
		err = os.WriteFile(destFilePath, srcFileContent, 0644)
		if err != nil {
			fmt.Printf("写入目标文件失败: %v\n", err)
			return err
		}

	}
	if isFix() {
		return errors.New("xmind has changed")
	}
	if err := CheckEnv(); err != nil {
		return err
	}
	//package.json------------------------------
	packageJson["main"] = "main/xmind.js"
	packageJson["version"] = "224.09.10311"
	packageFile, err := asarSys.GetFile("package.json")
	if err != nil {
		return err
	}
	updatedJsonData, err := json.Marshal(packageJson)
	*packageFile.DataBuffer = updatedJsonData
	//about.js----------------------------------
	aboutFile, err := asarSys.GetFile(filepath.Join("renderer", "about.js"))
	if err != nil {
		return err
	}
	newAboutFileString := fixAboutVersion(string(*aboutFile.DataBuffer))
	fileAdd([]byte(newAboutFileString), "renderer", "aboutt.js", asarSys)
	//dialog-gift-card.js-----------------------
	giftFile, err := asarSys.GetFile(filepath.Join("renderer", "dialog-gift-card.js"))
	if err != nil {
		return err
	}
	newGiftFileString := fixDialogGiftCard(string(*giftFile.DataBuffer))
	fileAdd([]byte(newGiftFileString), "renderer", "dialog-gift-cardd.js", asarSys)
	//dialog-signin.js--------------------------
	filePatch("renderer", "dialog-signin.js", "dialog-signinn.js",
		asarSys)
	//runtime.js--------------------------------
	runtimeFile, err := asarSys.GetFile(filepath.Join("renderer", "runtime.js"))
	if err != nil {
		return err
	}
	newRuntimeFileString := strings.Replace(string(*runtimeFile.DataBuffer), `"use strict";`, `"use strict";require("./336784");`, 1)
	newRuntimeData := []byte(newRuntimeFileString)
	*runtimeFile.DataBuffer = newRuntimeData
	//xmind,js--------------------------------
	filePatch("main", "xmind.js", "xmind.js",
		asarSys)
	//crypto.js--------------------------------
	filePatch("renderer", "crypto.js", "336784.js",
		asarSys)

	//gift.html--------------------------------
	giftHtmlFile, err := asarSys.GetFile(filepath.Join("renderer", "dialog-gift-card.html"))
	if err != nil {
		return err
	}
	newGiftHtmlString := strings.Replace(string(*giftHtmlFile.DataBuffer), `dialog-gift-card`, `dialog-gift-cardd`, 1)
	newGiftHtmlData := []byte(newGiftHtmlString)
	*giftHtmlFile.DataBuffer = newGiftHtmlData
	//about.html--------------------------------
	aboutHtmlFile, err := asarSys.GetFile(filepath.Join("renderer", "about.html"))
	if err != nil {
		return err
	}
	newAboutHtmlString := strings.Replace(string(*aboutHtmlFile.DataBuffer), `about`, `aboutt`, 1)
	newAboutHtmlData := []byte(newAboutHtmlString)
	*aboutHtmlFile.DataBuffer = newAboutHtmlData
	//login.html--------------------------------
	signHtmlFile, err := asarSys.GetFile(filepath.Join("renderer", "dialog-signin.html"))
	if err != nil {
		return err
	}
	newSignHtmlString := strings.Replace(string(*signHtmlFile.DataBuffer), `dialog-signin`, `dialog-signinn`, 1)
	newSignHtmlData := []byte(newSignHtmlString)
	*signHtmlFile.DataBuffer = newSignHtmlData

	//保存Asar文件
	if err = saveAsar(); err != nil {
		return err
	}
	return nil
}

func Restore() error {
	if !isFix() {
		return errors.New("xmind has been restored")
	}
	if err := CheckEnv(); err != nil {
		return err
	}
	//main/main.js
	packageJson["version"] = packageJson["buildVersion"]
	packageJson["main"] = "main/main.js"
	//修改package.json文件
	packageFile, err := asarSys.GetFile("package.json")
	if err != nil {
		return err
	}
	updatedJsonData, err := json.Marshal(packageJson)
	*packageFile.DataBuffer = updatedJsonData

	//gift.html--------------------------------
	giftHtmlFile, err := asarSys.GetFile(filepath.Join("renderer", "dialog-gift-card.html"))
	if err != nil {
		return err
	}
	newGiftHtmlString := strings.Replace(string(*giftHtmlFile.DataBuffer), `dialog-gift-cardd`, `dialog-gift-card`, 1)
	newGiftHtmlData := []byte(newGiftHtmlString)
	*giftHtmlFile.DataBuffer = newGiftHtmlData
	//about.html--------------------------------
	aboutHtmlFile, err := asarSys.GetFile(filepath.Join("renderer", "about.html"))
	if err != nil {
		return err
	}
	newAboutHtmlString := strings.Replace(string(*aboutHtmlFile.DataBuffer), `aboutt`, `about`, 1)
	newAboutHtmlData := []byte(newAboutHtmlString)
	*aboutHtmlFile.DataBuffer = newAboutHtmlData
	//login.html--------------------------------
	signHtmlFile, err := asarSys.GetFile(filepath.Join("renderer", "dialog-signin.html"))
	if err != nil {
		return err
	}
	newSignHtmlString := strings.Replace(string(*signHtmlFile.DataBuffer), `dialog-signinn`, `dialog-signin`, 1)
	newSignHtmlData := []byte(newSignHtmlString)
	*signHtmlFile.DataBuffer = newSignHtmlData

	//保存Asar文件
	if err = saveAsar(); err != nil {
		return err
	}
	return nil
}

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

func fixDialogGiftCard(jsCode string) string {
	card, _ := asset.ReadFile("asset/" + "dialog-gift-card.fix.js")
	re := regexp.MustCompile(`handleRedeem\.*:`)
	// 使用 ReplaceAllStringFunc 进行替换
	updatedJSCode := re.ReplaceAllString(jsCode, `handleRedeem:hook,abc:`)
	fixStr := string(card) + updatedJSCode
	return fixStr
}

func fixAboutVersion(jsCode string) string {
	re := regexp.MustCompile(`formatBuildNumber\.*:`)
	return re.ReplaceAllString(jsCode, `formatBuildNumber: () =>(new Date().getFullYear().toString().slice(-2) + '.' + (new Date().getMonth() + 1).toString().padStart(2, '0') + '.10310'),abc:`)
}

func filePatch(pDir string, srcFileName string, filename2sys string, sys *goAsarTool.SimpleFileSystem) {
	file2Patch, _ := asset.ReadFile("asset/" + srcFileName)
	fileData := goAsarTool.Afile{
		Offset:     "",
		Size:       float64(len(file2Patch)),
		Unpacked:   false,
		Path:       filepath.Join(pDir, filename2sys),
		IsDir:      false,
		DataBuffer: &file2Patch,
	}
	sys.CreateFile(&fileData)
}

func fileAdd(bytes []byte, pDir string, filename2sys string, sys *goAsarTool.SimpleFileSystem) {
	fileData := goAsarTool.Afile{
		Offset:     "",
		Size:       float64(len(bytes)),
		Unpacked:   false,
		Path:       filepath.Join(pDir, filename2sys),
		IsDir:      false,
		DataBuffer: &bytes,
	}
	sys.CreateFile(&fileData)
}

func saveAsar() error {
	newAppAsar := asarSys.CreateAsar(AsarFile)
	err := newAppAsar.Save()
	if err != nil {
		return err
	}
	return nil
}

// 比较两个版本号
func isValidVersion(version string) bool {
	v1Parts := strings.Split(version, ".")
	v2Parts := strings.Split(ValidVersion, ".")
	var v1, v2 int
	for i := 0; i < len(v1Parts) || i < len(v2Parts); i++ {
		if i < len(v1Parts) {
			v1, _ = strconv.Atoi(v1Parts[i]) // 转换为整数
		}
		if i < len(v2Parts) {
			v2, _ = strconv.Atoi(v2Parts[i]) // 转换为整数
		}
		if v1 < v2 {
			return false
		} else if v1 > v2 {
			return true
		}
	}
	return true
}
