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
	mux.HandleFunc("GET /api/levels", func(w http.ResponseWriter, r *http.Request) {
		levels, err := os.ReadFile("levels.json")
		if err != nil {
			http.Error(w, "Could not read levels.json file", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-type", "application/json")
		w.Write(levels)
	})
	mux.Handle("/", http.FileServer(http.Dir("static")))

	http.ListenAndServe(":8080", mux)
}