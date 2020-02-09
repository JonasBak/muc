package utils

import (
	"fmt"
	"github.com/nfnt/resize"
	"image/jpeg"
	"net/http"
)

func downloadImage(url string) ([]uint8, int, int, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, 0, 0, err
	}
	defer resp.Body.Close()
	m, err := jpeg.Decode(resp.Body)
	if err != nil {
		return nil, 0, 0, err
	}
	m = resize.Resize(128, 0, m, resize.Lanczos3)
	bounds := m.Bounds()

	pixels := make([]uint8, bounds.Dx()*bounds.Dy()*3)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, _ := m.At(x, y).RGBA()
			i := y*bounds.Dx() + x
			pixels[i*3] = uint8(r >> 8)
			pixels[i*3+1] = uint8(g >> 8)
			pixels[i*3+2] = uint8(b >> 8)
		}
	}

	return pixels, bounds.Dx(), bounds.Dy(), nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func distEst(pixels *[]uint8, a, b int) int {
	dr := int((*pixels)[a*3]) - int((*pixels)[b*3])
	dg := int((*pixels)[a*3+1]) - int((*pixels)[b*3+1])
	db := int((*pixels)[a*3+2]) - int((*pixels)[b*3+2])
	return dr*dr + dg*dg + db*db
}

func clusterGreedyKCenter(pixels []uint8, clusters int) ([]uint8, error) {
	clusters += 2
	pixels = append(pixels, 0, 0, 0, 255, 255, 255)
	c := []uint8{}
	d := make([]int, len(pixels)/3)
	for i, _ := range d {
		d[i] = int(^uint(0) >> 1)
	}

	u := len(d) - 1
	for k := 0; k < clusters; k++ {
		if k == 1 {
			u = len(d) - 2
		}
		c = append(c, pixels[u*3:u*3+3]...)
		newU := u
		d[u] = 0
		for i, _ := range d {
			d[i] = min(d[i], distEst(&pixels, i, u))
			if d[i] > d[newU] {
				newU = i
			}
		}
		u = newU
	}

	return c[6:], nil
}

func GetAlbumColors(url string) (string, error) {
	pixels, _, _, err := downloadImage(url)
	if err != nil {
		return "", err
	}
	rgbs, err := clusterGreedyKCenter(pixels, 3)
	if err != nil {
		return "", err
	}
	colors := ""
	for i := 0; i < len(rgbs)/3; i++ {
		colors = fmt.Sprintf("#%02X%02X%02X;%s", rgbs[i*3], rgbs[i*3+1], rgbs[i*3+2], colors)
	}
	return colors, nil
}
