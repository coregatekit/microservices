package main

import "github.com/gin-gonic/gin"

func main() {
	server := gin.New()

	server.Run(":8080")
}
