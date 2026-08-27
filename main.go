package main

import (
	"net/http"
	"os"
)
func main() {
	mux := http.NewServeMux()


	mux.HandleFunc("GET /api/parts", func(w http.ResponseWriter, r *http.Request) {
		parts, err := os.ReadFile("parts.json")
		if err != nil {
			http.Error(w, "Could not read parts data", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-type", "application/json")
		w.Write(parts)
	})
	mux.Handle("/", http.FileServer(http.Dir("static")))

	http.ListenAndServe(":8080", mux)
}