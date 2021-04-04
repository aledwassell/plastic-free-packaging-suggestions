package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	//"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DataProducts struct {
	Products []DataProduct `json:"products"`
}

type DataProduct struct {
	BarcodeNumber   string   `json:"barcode_number,omitempty"`
	BarcodeType     string   `json:"barcode_type,omitempty"`
	BarcodeFormat   string   `json:"barcode_formats,omitempty"`
	MPN             string   `json:"mpn,omitempty"`
	Model           string   `json:"model"`
	Asin            string   `json:"asin"`
	ProductName     string   `json:"product_name"`
	Title           string   `json:"title"`
	Category        string   `json:"category"`
	Manufacturer    string   `json:"manufacturer"`
	Brand           string   `json:"brand"`
	Label           string   `json:"label"`
	Author          string   `json:"author"`
	Publisher       string   `json:"publisher"`
	Artist          string   `json:"artist"`
	Actor           string   `json:"actor"`
	Director        string   `json:"director"`
	Studio          string   `json:"studio"`
	Genre           string   `json:"genre"`
	AudienceRating  string   `json:"audience_rating"`
	Ingredients     string   `json:"ingredients"`
	NutritionFacts  string   `json:"nutrition_facts"`
	Color           string   `json:"color"`
	Format          string   `json:"format"`
	PackageQuantity string   `json:"package_quantity"`
	Size            string   `json:"size"`
	Length          string   `json:"length"`
	Width           string   `json:"width"`
	Height          string   `json:"height"`
	Weight          string   `json:"weight"`
	ReleaseDate     string   `json:"release_date"`
	Description     string   `json:"description"`
	Features        []string `json:"features"`
	Images          []string `json:"images"`
	Stores          []Store  `json:"store"`
}

type Store struct {
	StoreName      string `json:"store_name"`
	StorePrice     string `json:"store_price"`
	ProductUrl     string `json:"product_url"`
	CurrencyCode   string `json:"currency_code"`
	CurrencySymbol string `json:"currency_symbol"`
}

type Product struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Barcode     string             `json:"barcode,omitempty" bson:"barcode,omitempty"`
	ProductName string             `json:"product_name,omitempty" bson:"product_name,omitempty"`
	BrandName   string             `json:"brand_name,omitempty" bson:"brand_name,omitempty"`
	ImageURL    string             `json:"image_url,omitempty" bson:"image_url,omitempty"`
}

var client *mongo.Client

func LookupBarcode(res http.ResponseWriter, req *http.Request) {
	res.Header().Add("content-type", "application/json")
	params := mux.Vars(req)
	code, _ := params["code"]
	product, err := GetProduct(code)
	if err != nil {
		product, err := FetchProduct(code)
		if err != nil {
			res.WriteHeader(http.StatusInternalServerError)
			res.Write([]byte(`{"message": "` + err.Error() + `"}`))
			return
		} else {
			json.NewEncoder(res).Encode(product)
			CreateProduct(*product)
			return
		}
	}
	json.NewEncoder(res).Encode(product)
}

// Fetches the product from the lookup barcode API.
func FetchProduct(code string) (*Product, error) {
	var product *Product
	//res, err := http.Get(fmt.Sprintf("https://api.barcodelookup.com/v2/products?barcode=%s&key=1wc27oyy0ql6p6dqg9fr9dsmnanbe6", code))
	//defer res.Body.Close()
	jsonFile, err := os.Open("data.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened users.json")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()
	if err != nil {
		return nil, err
	} else {
		//data, _ := ioutil.ReadAll(res.Body)
		data, _ := ioutil.ReadAll(jsonFile)
		product = &Product{}
		var result DataProducts
		if err := json.Unmarshal([]byte(data), &result); err != nil {
			log.Fatal(err)
		}
		product.Barcode = result.Products[0].BarcodeNumber
		product.ProductName = result.Products[0].ProductName
		product.BrandName = result.Products[0].Brand
		product.ImageURL = result.Products[0].Images[0]
	}
	return product, nil
}

// Gets a product from the DB, returns nil if no product is found.
func GetProduct(code string) (*Product, error) {
	var product Product
	collection := client.Database("plasticFreeProducts").Collection("products")
	filter := bson.D{{"code", code}}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err := collection.FindOne(ctx, filter).Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

// Create a product.
func CreateProduct(product Product) {
	fmt.Println(product)
	collection := client.Database("plasticFreeProducts").Collection("products")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	_, err := collection.InsertOne(ctx, product)
	if err != nil {
		log.Fatal(err)
		return
	}
}

func main() {
	port := ":8080"
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, _ = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	r := mux.NewRouter()
	fmt.Printf("Server running @ http://localhost%s\n", port)
	//r.HandleFunc("/contact", CreatContact).Methods("POST")
	//r.HandleFunc("/remove-contact/{id}", DeleteContact).Methods("DELETE")
	r.HandleFunc("/lookup/{code}", LookupBarcode).Methods("GET")
	http.ListenAndServe(port, r)
}