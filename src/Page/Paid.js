import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  withMobileDialog,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Popover,
  Snackbar,
  Slide,
  FormControlLabel,
  Switch
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios'

const URL = 'http://localhost:3000'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = (theme) =>({
  root: {
    flexGrow: 1,
  },
  content: {
    position:'relative',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  table:{
    width:'95%',
    margin:'0 auto',
    marginTop: 10
  },
  head: {
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
  search:{
    position: 'fixed',
    bottom: theme.spacing.unit * 14,
    right: theme.spacing.unit * 4,
  },
  add: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
  },
  span:{
    display:'inline',
    marginLeft:theme.spacing.unit *2
  },
  div:{},
  snackbar: {
    position: 'absolute',
  },
  snackbarContent: {
    width: 240,
  },
})

class Paid extends React.Component{
  constructor(props){
    super(props)
    this.state={
      all:[],
      Index: 0,
      open: false, // dialog
      id: '',
      pop: false, // popover
      snack:false, // snackbar
      status:false, // for update database
      filter:true
    }
    this.changeIndex = this.changeIndex.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePop = this.handlePop.bind(this)
    this.handleClosePop = this.handleClosePop.bind(this)
    this.handlePost = this.handlePost.bind(this)
    this.Year = (new Date().getFullYear() - 1911)-100 + 4 // 107 -> 11 = 7+4
    this.tab = []
    for(let i=this.Year;i>3;i-=1){
      this.tab.push(`${("0"+i).substr(-2)}級`)
    }
  }
  componentDidMount(){
    axios.get(`${URL}/_api/students`).then(
      res=>this.setState({all:res.data})
    )
  }
  changeIndex(e,v){
    this.setState({Index:v})
  }
  handleOpen(){
    this.setState({open:true})
  }
  handlePop(){
    this.setState({pop:true})
  }
  handleClosePop(){
    this.setState({pop:false,id:''})
  }
  handleClose(){
    this.setState({open:false,id:''})
  }
  handleChange(e){
    this.setState({id:e})
  }
  handlePost(){
    axios.post(`${URL}/_api/pay`,{id:this.state.id.trim()}).then(
      res=> {
      this.setState({
        status:res.data,
        snack:true,
        open:false,
        id:''
      })
      }
    )
  }
  render(){
    const {classes,fullScreen} = this.props
    return(
      <div className={classes.root}>
        <div className={classes.content}>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.filter}
              onChange={()=>this.setState({filter:!this.state.filter})}
              color="primary"
            />
          }
          label="僅顯示已繳交系學會費"
        />
          <Tabs 
            value={this.state.Index} 
            onChange={this.changeIndex}
            scrollable
            scrollButtons="on">
            {this.tab.map((tab,index) =>
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
              .filter(student=>
                student.id.startsWith(("0"+(this.Year-this.state.Index-4)).substr(-2))
                && ( !this.state.filter || student.paid === 1 )
              ).sort((a,b)=> a.id.localeCompare(b.id, 'zh-Hant-TW'))
              .map((student,index)=>
                <TableRow key={index} className={classes.row}>
                  <TableCell  className={classes.body}>{student.id}</TableCell>
                  <TableCell  className={classes.body}>{student.name}</TableCell>
                </TableRow>
              )
            }
            </TableBody>
          </Table>
        </div>
        <Button variant="fab" className={classes.search} color="primary" onClick={this.handlePop}
        buttonRef={node => {
                this.anchorEl = node;
              }}>
          <SearchIcon/>
        </Button>
        <Button variant="fab" className={classes.add} color="secondary" onClick={this.handleOpen}>
          <AddIcon/>
        </Button>
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
                onChange={e=>this.handleChange(e.target.value)}
                placeholder="請輸入學號"
                margin="normal"
                type='tel'
                autoFocus
                onKeyPress={(e)=>{if(e.key === 'Enter')this.handlePost()}}
              />
              <div className={fullScreen?classes.div:classes.span}>{`${this.state.all.filter(s=>s.id === this.state.id.trim()).map(s=>`${s.name} (${s.paid?'已繳費':'尚未繳費'})`).join('')}`}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              捨棄
            </Button>
            <Button onClick={this.handlePost} color="primary" disabled={this.state.all.some(s=>(s.id === this.state.id.trim() && s.paid === 1))}>
              確認
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
                onChange={e=>this.handleChange(e.target.value)}
                placeholder="請輸入學號"
                margin="normal"
                type='tel'
                autoFocus
              />
              <div>{`${this.state.all.filter(s=>s.id === this.state.id.trim()).map(s=>`${s.name} (${s.paid?'已繳費':'尚未繳費'})`).join('')}`}</div>
          </DialogContent>
        </Popover>
        <Snackbar
            open={this.state.snack}
            autoHideDuration={2000}
            onClose={()=>this.setState({snack:false})}
            TransitionComponent={TransitionUp}
            anchorOrigin={{horizontal:'left',vertical:'bottom'}}
            ContentProps={{
              'aria-describedby': 'message',
              className: classes.snackbarContent,
            }}
            message={<span id='message'>{`${this.state.status.success?`新增成功 id=${this.state.status.id}`:`新增失敗 id=${this.state.status.id}`}`}</span>}
            action={
              <Button color="inherit" size="small" onClick={()=>this.setState({snack:false})}>
                <CloseIcon/>
              </Button>
            }
            className={classes.snackbar}
          />
      </div>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(Paid))