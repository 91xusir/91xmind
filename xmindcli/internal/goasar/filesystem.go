package goasar

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// SimpleFileSystem 系统结构体
type SimpleFileSystem struct {
	directories map[string]*Afile // 目录和文件映射 	// 文件大小
	count       int               // 文件数量
}

// NewSimpleFileSystem 创建一个新的文件系统
func NewSimpleFileSystem() *SimpleFileSystem {
	return &SimpleFileSystem{
		directories: make(map[string]*Afile),
	}
}

// NewSimpleFileSystemByAsar 创建一个新asar的文件系统
func NewSimpleFileSystemByAsar(asar *Asar) (*SimpleFileSystem, error) {
	sys := NewSimpleFileSystem()
	err := sys.creatSysByAsar(asar)
	return sys, err
}

// CreateFile 创建和修改
func (fs *SimpleFileSystem) CreateFile(file *Afile) {
	fs.directories[file.Path] = file
}

// GetFile 获取文件
func (fs *SimpleFileSystem) GetFile(path string) (*Afile, error) {
	file, exists := fs.directories[path]
	if !exists {
		return nil, errors.New("file not found")
	}
	return file, nil
}

// DeleteFile 删除文件
func (fs *SimpleFileSystem) DeleteFile(path string) error {
	if _, exists := fs.directories[path]; !exists {
		return errors.New("file not found")
	}
	delete(fs.directories, path)
	return nil
}

func (fs *SimpleFileSystem) ListFiles() {
	for _, file := range fs.directories {
		if file.Unpacked {
			fmt.Printf(" Unpacked: %v File: %s \n", file.Unpacked, file.Path)
		} else {
			fmt.Printf(" Size: %d,Offset: %s Unpacked: %v File: %s \n", len(*file.DataBuffer), file.Offset, file.Unpacked, file.Path)
		}
	}
}

func (fs *SimpleFileSystem) CreateAsar(path string) *Asar {
	offset := 0
	var byteBuffer bytes.Buffer
	for _, f := range fs.directories {
		if !f.Unpacked {
			// 设置文件大小为其数据缓冲区的长度
			size := len(*f.DataBuffer)
			f.Size = float64(size)
			f.Offset = strconv.Itoa(offset)
			// 增加偏移量，以便下一个文件能够从正确的位置开始存储
			offset += size
			_, err := io.Copy(&byteBuffer, bytes.NewReader(*f.DataBuffer))
			if err != nil {
				fmt.Println("Error:", err)
			}
		}
	}
	JsonHeaderMap := files2JsonMap(fs.directories)
	newAsarFile := NewAsarFile(path)
	newAsarFile.JsonHeaderStrMap = JsonHeaderMap
	// 将结果映射转换为 JSON 格式，并进行缩进格式化。
	JsonHeaderStrBytes, err := json.Marshal(JsonHeaderMap)
	if err != nil {
		fmt.Println("Error:", err)
	}
	newAsarFile.JsonHeaderStrBytes = &JsonHeaderStrBytes
	newAsarFile.JsonHeaderLength = uint32(len(JsonHeaderStrBytes))
	newAsarFile.JsonHeaderSize = 4 + roundup(newAsarFile.JsonHeaderLength, 4)
	newAsarFile.HeaderLength = newAsarFile.JsonHeaderSize + 4
	newAsarFile.HeaderSize = uint32(4)
	dateBytes := byteBuffer.Bytes()
	newAsarFile.DataBuffer = &dateBytes
	return newAsarFile
}
func (fs *SimpleFileSystem) creatSysByAsar(asar *Asar) error {

	type fileStackItem struct {
		fullPath string
		fileList map[string]interface{}
	}
	strMap := asar.JsonHeaderStrMap["files"].(map[string]interface{})
	stack := []fileStackItem{{"", strMap}} // 初始化栈
	for len(stack) > 0 {
		// 弹出栈顶元素
		current := stack[len(stack)-1] // 获取栈顶元素
		stack = stack[:len(stack)-1]   // 弹出
		// 遍历当前目录中的文件和子目录
		for name, info := range current.fileList {
			// 将文件名与前缀拼接成完整路径
			fullPath := filepath.Join(current.fullPath, name)
			if subFiles, ok := info.(map[string]interface{}); ok && subFiles["files"] != nil {
				//包含"files"键，则认为是目录,将目录压栈
				stack = append(stack, fileStackItem{fullPath, subFiles["files"].(map[string]interface{})})
			} else if file, ok := info.(map[string]interface{}); ok {
				// 是文件
				size, sizeOk := file["size"].(float64)
				unpacked, unpackedOk := file["unpacked"].(bool)
				offset, offsetOk := file["offset"].(string)
				if sizeOk && offsetOk && !unpacked {
					f := Afile{
						Offset:   offset,
						Size:     size,
						Unpacked: false,
						Path:     fullPath,
						IsDir:    false,
					}

					of, _ := strconv.Atoi(f.Offset)
					si := (int)(f.Size)
					subData := (*asar.DataBuffer)[of : of+si]
					copiedData := make([]byte, len(subData))
					copy(copiedData, subData)
					f.DataBuffer = &copiedData
					fs.CreateFile(&f)
				} else if unpackedOk && unpacked {
					f := Afile{
						Offset:   "0",
						Size:     size,
						Unpacked: true,
						Path:     fullPath,
						IsDir:    false,
					}
					fs.CreateFile(&f)
				} else {
					//[鹿鱼][2024/5/28]TODO:空文件夹
				}
			}

		}

	}
	//asar.DataBuffer = nil
	//runtime.GC()
	return nil
}
func (fs *SimpleFileSystem) CountSize() int {
	size := 0
	for _, s := range fs.directories {
		if !s.Unpacked {
			size += len(*s.DataBuffer)
		}
	}
	return size
}

// Extract 解压
func (fs *SimpleFileSystem) Extract(dirPath string) error {
	// 创建文件夹
	err := os.MkdirAll(dirPath, os.ModePerm)
	if err != nil {
		return err
	}
	// 遍历文件系统中的文件信息
	for _, f := range fs.directories {
		if f.Unpacked {
			continue
		}
		// 构建文件完整路径
		fPath := filepath.Join(dirPath, f.Path)
		// 创建文件并写入数据
		dir := filepath.Dir(fPath)
		err := os.MkdirAll(dir, os.ModePerm)
		err = os.WriteFile(fPath, *f.DataBuffer, os.ModePerm)
		if err != nil {
			fmt.Println(err)
		}
	}
	return nil
}

func files2JsonMap(files map[string]*Afile) map[string]interface{} {

	// 创建一个空的结果映射，用于存储转换后的文件信息。
	result := make(map[string]interface{})

	// 遍历文件信息数组，将每个文件信息转换为分层结构。
	for _, file := range files {
		// 获取文件路径，并将其拆分为路径段。
		path := file.Path
		parts := strings.Split(path, Separator)
		curr := result

		// 遍历路径段，构建分层结构。
		for i, part := range parts {
			// 如果当前路径段不存在，则创建相应的映射。
			if _, ok := curr[part]; !ok {
				// 如果是最后一个路径段，则将文件信息添加到当前映射中。
				if i == len(parts)-1 && !file.IsDir {
					curr[part] = map[string]interface{}{
						"offset":   file.Offset,
						"size":     file.Size,
						"unpacked": file.Unpacked,
					}
				} else {
					// 否则，创建名为 "files" 的属性，并继续向下遍历。
					curr[part] = make(map[string]interface{})
					curr[part].(map[string]interface{})["files"] = make(map[string]interface{})
					curr = curr[part].(map[string]interface{})["files"].(map[string]interface{})
				}
			} else {
				// 如果当前路径段已经存在，并且是最后一个路径段，则更新文件信息。
				if i == len(parts)-1 && !file.IsDir {
					curr[part].(map[string]interface{})["offset"] = file.Offset
					curr[part].(map[string]interface{})["size"] = int(file.Size)
					curr[part].(map[string]interface{})["unpacked"] = file.Unpacked
				} else {
					// 否则，继续向下遍历。
					curr = curr[part].(map[string]interface{})["files"].(map[string]interface{})
				}
			}
		}
	}

	//// 将结果映射转换为 JSON 格式，并进行缩进格式化。
	//output, err := json.Marshal()
	//if err != nil {
	//	fmt.Println("Error:", err)
	//	return nil
	//}
	return map[string]interface{}{"files": result}
}
func roundup(x, y uint32) uint32 {
	return (x + y - 1) & ^(y - 1)
}
