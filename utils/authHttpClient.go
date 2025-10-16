package utils

import "net/http"

type AuthClient struct {
	Token string
	Base  *http.Client
}

func (c *AuthClient) Do(req *http.Request) (*http.Response, error) {
	if c.Token != "" {
		req.Header.Set("Authorization", "token "+c.Token)
	}
	return c.Base.Do(req)
}
