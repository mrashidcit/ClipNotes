# briefnote

> Rapid tags, note taking application for Mac, Windows and Linux

## Roadmap
### v0.1.0
#### Create new note
- [x] Able to create new note by *pasting TEXT or HTML* from **clipboard**.
- [ ] Able to create new note by *pasting a screenshot* from **clipboard**.
- [x] Able to create new note by *pasting an Image* (any format) from **file system**.
#### Tag management
- [ ] Able to **create new tag**.
- [ ] Able to **assing or remove tag** from selected note.
#### Search by filter
- [ ] Able to search notes by **tag filter**.
- [ ] Able to serch notes by **name or description filter**.

### v0.2.0
#### Integrations
- [ ] Able to integrate **Dropbox** or **Google Drive**.
- [ ] Able to access application from **Command-line** or **Sockets**.

## Development Instructions
This project is created using [electron-vue](https://github.com/SimulatedGREG/electron-vue) template. Apart from this template and application dependencies, you need to have following setup to start developing/debugging *briefnote* application.
* *Windows* or *OSX* or *Linux* OS platform
* *NodeJs* standard version

## Build Instructions

``` bash
# install dependencies
npm install

# rebuild dependencies for ElectronJs
npm run rebuild-for-electron

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```
---

## License
[MIT](https://opensource.org/licenses/MIT)

## Contact
[hello@xplorebits.com](mailto:hello@xplorebits.com)
