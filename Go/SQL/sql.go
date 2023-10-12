package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"net/http"
	"time"
)

type data struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
}
type Rank struct {
	Name  string
	Score int
}

var Records []data
var Record []Rank
var item Rank

func main() {
	DSN := "root:V%dro!hHl35dff@tcp(localhost:3306)/ranking"
	db, err := gorm.Open(mysql.Open(DSN), &gorm.Config{})//连接数据库
	if err != nil {
		panic(err)
	}
	r := gin.Default()
	//添加中间件实现跨域
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/", func(c *gin.Context) {
		err := db.Find(&Record).Error
		if err != nil {
			panic(err)
		}
		fmt.Println(Record)
		c.JSON(http.StatusOK, Record)
	})
	r.POST("/", func(c *gin.Context) {
		err := c.BindJSON(&Records)
		fmt.Println(Records)
		if err != nil {
			panic(err)
		}
		db.Exec("TRUNCATE TABLE ranks;")
		for _, x := range Records {
			if x.Name != "" {
				fmt.Println(x)
				item.Score = x.Score
				item.Name = x.Name
				db.Create(&item)
			}
		}
	})
	r.Run()
}
