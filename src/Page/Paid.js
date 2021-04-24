import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Fab,
  withMobileDialog,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Popover,
  Tooltip
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import axios from 'axios'
import { withSnackbar } from 'notistack'
import API_URL from '../constants'

axios.defaults.withCredentials = true

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  table: {
    width: '95%',
    margin: '0 auto',
    marginTop: 10
  },
  head: {
    width: '50%',
    textAlign: 'center',
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 14,
  },
  body: {
    textAlign: 'center',
    fontSize: 14,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  search: {
    position: 'fixed',
    bottom: theme.spacing(24),
    right: theme.spacing(4),
  },
  batch: {
    position: 'fixed',
    bottom: theme.spacing(14),
    right: theme.spacing(4),
    background: '#4caf50',
    '&:hover': {
      background: '#388e3c',
    },
  },
  add: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  span: {
    display: 'inline',
    marginLeft: theme.spacing(2)
  },
  div: {},
  snackbar: {
    position: 'absolute',
  },
  snackbarContent: {
    width: 240,
  },
})

const PaidTextField = withStyles({
  root: {
    '& label.Mui-disabled': {
      color: '#4caf50',
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      '& fieldset': {
        borderColor: '#4caf50',
        borderWidth: '2px',
      },
    },
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'black',
    },
  },
})(TextField);
const NotPaidTextField = withStyles({
  root: {
    '& label.Mui-disabled': {
      color: '#f44336',
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      '& fieldset': {
        borderColor: '#f44336',
        borderWidth: '2px',
      },
    },
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'black',
    },
  },
})(TextField);

class Paid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      all: [],                // The student list
      Index: 0,               // Currently opened tab
      open: false,            // The dialog (Search/Add)
      id: '',                 // The Textfield value in dialogs
      pop: false,             // popover
      login: false,           // User logged-in
      openBatch: false,       // The dialog (Batch Search)
      idBatch: '',            // The Textfield in batch dialog
      resultBatch: ['', ''],  // The Batch Results
      id2paid: {},            // The map from id to paid
      id2name: {},            // The map from id to name
    }
    this.changeIndex = this.changeIndex.bind(this)

    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.handleCloseBatch = this.handleCloseBatch.bind(this)
    this.handleOpenBatch = this.handleOpenBatch.bind(this)
    this.handleChangeBatch = this.handleChangeBatch.bind(this)
    this.handleBatchQuery = this.handleBatchQuery.bind(this)

    this.handlePop = this.handlePop.bind(this)
    this.handleClosePop = this.handleClosePop.bind(this)

    this.handlePost = this.handlePost.bind(this)
    this.Year = (new Date().getFullYear() - 1911) - 100 + 4 // 107 -> 11 = 7+4
    this.tab = []
    for (let i = this.Year; i > 4; i -= 1) {
      this.tab.push(`${("0" + i).substr(-2)}級`)
    }
  }
  componentDidMount() {
    axios.get(`${API_URL}/students`).then(res => res.data).then(
      all => {
        const id2paid = {}
        all.forEach(item => id2paid[item.id] = (item.paid === 1))
        const id2name = {}
        all.forEach(item => id2name[item.id] = item.name)
        this.setState({ all, id2paid, id2name })
      }
    ).catch(err => { if (err.response && err.response.status === 401) window.location.href = '/login' })
  }

  changeIndex(e, v) {
    this.setState({ Index: v })
  }

  handleOpen() {
    this.setState({ open: true })
  }
  handleClose() {
    this.setState({ open: false, id: '' })
  }
  handleChange(e) {
    this.setState({ id: e })
  }

  handleOpenBatch() {
    this.setState({ openBatch: true })
  }
  handleCloseBatch() {
    this.setState({ openBatch: false, idBatch: '', resultBatch: ['', ''] })
  }
  handleChangeBatch(e) {
    this.setState({ idBatch: e })
  }
  handleBatchQuery() {
    const paid = []
    const notpaid = []
    this.state.idBatch
      .split('\n').filter(e => e)
      .map(e => e.trim().length < 7 ? ('0000000' + e.trim()).slice(-7) : e.trim())
      .forEach(e => {
        if (this.state.id2paid[e])
          paid.push(e)
        else
          notpaid.push(e)
      })
    this.setState({ resultBatch: [paid.sort().join('\n'), notpaid.sort().join('\n')] })
  }

  handlePop() {
    this.setState({ pop: true })
  }
  handleClosePop() {
    this.setState({ pop: false, id: '' })
  }

  handlePost() {
    axios.post(`${API_URL}/pay`, { id: this.state.id.trim() }).then(
      res => {
        this.setState({
          open: false,
          id: ''
        })
        if (res.data.success) {
          const all = this.state.all.map(ele => ({ ...ele }))
          const id2paid = { ...this.state.id2paid }
          for (let i = 0; i < all.length; i++) {
            if (all[i].id === res.data.id) {
              all[i].paid = 1
              break
            }
          }
          id2paid[res.data.id] = true
          this.setState({
            all, id2paid
          })
          this.props.enqueueSnackbar(`新增成功 id=${res.data.id}`, {
            variant: 'success',
          })
        }
        else {
          this.props.enqueueSnackbar(`新增失敗 id=${res.data.id}`, {
            variant: 'error',
          })
        }
      }
    ).catch(
      err => {
        this.setState({
          open: false,
          id: ''
        })
        this.props.enqueueSnackbar(err.toString(), {
          variant: 'error',
        })
      }
    )
  }
  render() {
    const { classes, fullScreen } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Tabs
            value={this.state.Index}
            onChange={this.changeIndex}
            scrollable="true"
            scrollButtons="on">
            {this.tab.map((tab, index) =>
              <Tab key={index} value={index} label={tab} />
            )}
          </Tabs>
          <Table className={classes.table}>
            <TableHead>
              <TableRow >
                <TableCell className={classes.head}>學號</TableCell>
                <TableCell className={classes.head}>姓名</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.all
                  .filter(student =>
                    (
                      (student.id.length === 7 && student.id.startsWith(("0" + (this.Year - this.state.Index - 4)).substr(-2)))
                      || (student.id.length === 9 && student.id.startsWith(("1" + ("0" + (this.Year - this.state.Index - 4)).substr(-2))))
                    )
                    && (!this.props.filter || student.paid === 1)
                  ).sort((a, b) => a.id.localeCompare(b.id, 'zh-Hant-TW'))
                  .map((student, index) =>
                    <TableRow key={index} className={classes.row}>
                      <TableCell className={classes.body}>{student.id}</TableCell>
                      <TableCell className={classes.body}>{student.name}</TableCell>
                    </TableRow>
                  )
              }
            </TableBody>
          </Table>
        </div>
        <Tooltip title="查詢是否繳費" placement="left">
          <Fab className={classes.search} color="primary" onClick={this.handlePop}
            buttonRef={node => {
              this.anchorEl = node;
            }}>
            <SearchIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="批量分類查詢" placement="left">
          <Fab className={classes.batch} color="secondary" onClick={this.handleOpenBatch}>
            <LibraryBooksIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="繳費登記" placement="left">
          <Fab className={classes.add} color="secondary" onClick={this.handleOpen}>
            <AddIcon />
          </Fab>
        </Tooltip>

        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>{"繳費登記"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              此操作會存入資料庫，請確認登記學號姓名是否正確
              </DialogContentText>
            <TextField
              label="學號"
              value={this.state.id}
              onChange={e => this.handleChange(e.target.value)}
              placeholder="請輸入學號"
              margin="normal"
              type='tel'
              autoFocus
              onKeyPress={(e) => { if (e.key === 'Enter') this.handlePost() }}
            />
            <div className={fullScreen ? classes.div : classes.span}>{this.state.id2name[this.state.id.trim()] && `${this.state.id2name[this.state.id.trim()]} (${this.state.id2paid[this.state.id.trim()] ? '已繳費' : '尚未繳費'})`}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              捨棄
            </Button>
            <Button onClick={this.handlePost} color="primary" disabled={this.state.all.some(s => (s.id === this.state.id.trim() && s.paid === 1))}>
              確認
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={this.state.openBatch}
          onClose={this.handleCloseBatch}
          maxWidth='sm'
          fullWidth={true}
        >
          <DialogTitle>批量分類查詢</DialogTitle>
          <DialogContent>
            <DialogContentText>
              將學號分行輸入下方欄位後按下分類按鈕
              </DialogContentText>
            {
              fullScreen ?
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <TextField label="輸入學號" multiline rows={6} autoFocus
                    value={this.state.idBatch} placeholder="請輸入學號"
                    margin="normal" variant="outlined" fullWidth
                    onChange={e => this.handleChangeBatch(e.target.value)}
                  />
                  <Button variant="contained" color="primary" disableElevation style={{
                    height: 'max-content',
                    // margin: '8px 0px'
                  }} onClick={this.handleBatchQuery}>分類</Button>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}>
                    <PaidTextField label="已繳費" multiline rows={6} value={this.state.resultBatch[0]}
                      margin="normal" variant="outlined" disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    &nbsp;
                    <NotPaidTextField label="未繳費" multiline rows={6} value={this.state.resultBatch[1]}
                      margin="normal" variant="outlined" disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div> :
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <TextField label="輸入學號" multiline rows={15} autoFocus
                    value={this.state.idBatch} placeholder="請輸入學號"
                    margin="normal" variant="outlined"
                    onChange={e => this.handleChangeBatch(e.target.value)}
                  />
                  <Button variant="contained" color="primary" disableElevation style={{
                    height: 'max-content',
                    margin: '0px 16px'
                  }} onClick={this.handleBatchQuery}>分類</Button>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <PaidTextField label="已繳費" multiline rows={6} value={this.state.resultBatch[0]}
                      margin="normal" variant="outlined" disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <NotPaidTextField label="未繳費" multiline rows={6} value={this.state.resultBatch[1]}
                      margin="normal" variant="outlined" disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseBatch} color="primary">
              關閉
            </Button>
          </DialogActions>
        </Dialog>

        <Popover
          open={this.state.pop}
          anchorEl={this.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={this.handleClosePop}
        >
          <DialogTitle>{"搜尋"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              使用學號搜尋是否有繳交系學會費
              </DialogContentText>
            <TextField
              label="學號"
              value={this.state.id}
              onChange={e => this.handleChange(e.target.value)}
              placeholder="請輸入學號"
              margin="normal"
              type='tel'
              autoFocus
            />
            <div>{this.state.id2name[this.state.id.trim()] && `${this.state.id2name[this.state.id.trim()]} (${this.state.id2paid[this.state.id.trim()] ? '已繳費' : '尚未繳費'})`}</div>
          </DialogContent>
        </Popover>
      </div>
    )
  }
}
const mapState = (state) => ({
  filter: state.filter
})

export default withMobileDialog()(withSnackbar(withStyles(styles)(connect(mapState)(Paid))))