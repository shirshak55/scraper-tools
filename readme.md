# Scrapper Tools

Currently on develop and don't follow semantic versioning

After 1.0.0 it will follow semantic versioning

## Handbook

To Debug use xfvb

On Remote

```bash
Xvfb :99 &
```

On LocalPC use SSH Tunnel

```bash
ssh -p 2222 vagrant@127.0.0.1 -L 5900:127.0.0.1:5900 -N,
brew install tiger-vnc
vncviewer 127.0.0.1:5900
```

On Remote PC

```bash
DISPLAY=:99 yarn start ....
```
