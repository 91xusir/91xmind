//go:generate goversioninfo -icon=../res/icon.ico -manifest=../res/go.exe.manifest
package main

import (
	"fmt"
	"os"
	"path/filepath"
	crack "xmindcli/internal/crack"
	goAsarTool "xmindcli/internal/goasar"
)

func main() {
	if len(os.Args) >= 2 { // 如果命令行参数大于等于2 解压asar用
		asarExtract()
		return
	}

	if err := crack.Prepare(); err != nil {
		fmt.Println(err)
		// 提示用户按回车键退出
		fmt.Println("按回车键退出...")
		_, _ = fmt.Scanln()
		os.Exit(0)
	}
	var choice int
	for {
		fmt.Println("------Xmind Active------")
		fmt.Println("1. 切换")
		fmt.Println("2. 恢复")
		fmt.Println("3. 退出")
		fmt.Println("-------------------------")
		fmt.Print("请输入对应数字,按回车确认:")
		_, err := fmt.Scan(&choice)
		if err != nil {
			fmt.Println("输入错误，请重新选择")
			continue
		}
		switch choice {
		case 1:
			changeActiveServer(false)
		case 2:
			restoreActiveServer()
		case 91:
			offlineActive()
		case 3:
			os.Exit(0)
		default:
			fmt.Println("无效选项，请重新选择！")
		}
	}
}

func offlineActive() {
	changeActiveServer(true)

}
func asarExtract() {
	// 获取第一个命令行参数，即拖动到可执行文件的文件路径
	fPath := os.Args[1]
	if _, err := os.Stat(fPath); err != nil {
		return
	}
	//初始化文件信息
	appAsar := goAsarTool.NewAsarFile(fPath)
	//读取到内存
	err := appAsar.Open()
	if err != nil {
		return
	}
	asarSys, err := goAsarTool.NewSimpleFileSystemByAsar(appAsar)
	if asarSys == nil {
		return
	}
	dirPath := filepath.Join(filepath.Dir(fPath), "app")
	fmt.Println("正在解压...")
	err = asarSys.Extract(dirPath)
	if err != nil {
		return
	}
}
func changeActiveServer(isOfflineActive bool) {
	err := crack.StartPatch(isOfflineActive)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("切换成功！")
}
func restoreActiveServer() {
	err := crack.Restore()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("恢复成功！")
}
