package handler

import (
	"appstore/util"
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var mySigningKey []byte

func InitRouter(config *util.TokenInfo) http.Handler {
    mySigningKey = []byte(config.Secret)

    jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
        ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
            return []byte(mySigningKey), nil
        },
        SigningMethod: jwt.SigningMethodHS256,
    })

    router := mux.NewRouter()

    // use middleware where we need authentification with tokens
    router.Handle("/upload", jwtMiddleware.Handler(http.HandlerFunc(uploadHandler))).Methods("POST")
    router.Handle("/checkout", jwtMiddleware.Handler(http.HandlerFunc(checkoutHandler))).Methods("POST")    
    router.Handle("/search", jwtMiddleware.Handler(http.HandlerFunc(searchHandler))).Methods("GET")
    router.Handle("/delete/{id}", jwtMiddleware.Handler(http.HandlerFunc(deleteHandler))).Methods("Delete")
    router.Handle("/signup", http.HandlerFunc(signupHandler)).Methods("POST")
    router.Handle("/signin", http.HandlerFunc(signinHandler)).Methods("POST")

    originsOk := handlers.AllowedOrigins([]string{"*"}) // can support request from any domain origin
    headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type"}) // allow these headers
    methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "DELETE"}) // with these methods

    return handlers.CORS(originsOk, headersOk, methodsOk)(router)

}