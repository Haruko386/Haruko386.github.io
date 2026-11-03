type World interface {
	Execute(me *Me) types.Nil
}

type Life struct {
	ctx context.Context
}

func (l *Life) Execute(me *Me) types.Nil {
	me.wg.Add(1)
	go func() {
		defer me.wg.Done()
		for {
			me.Time = time.Now()
			select {
			case in := <-me.in:
				switch me.freedom.(type) {
				case string:
					_ = in
				case types.Object:
					log.Print("Not for now")
				}
			default:
				me.Time = me.Add(24 * time.Hour)
			}
		}
	}()
	return types.Nil{}
}
