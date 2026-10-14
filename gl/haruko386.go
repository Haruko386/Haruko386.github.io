/* context.Json("Live my Happy life (2026/7/24)") */

type Me struct {
	time.Time
	Me   struct{}
	they sync.Map
	// she  unique.Handle[types.Error]
	in      <-chan any
	freedom any
	wg sync.WaitGroup
}

func (m *Me) life() types.Nil { 
	m.wg.Add(1)
	go func() {
		defer m.wg.Done()
		for {
			m.Time = time.Now()
			select {
			case in := <-m.in:
				switch m.freedom.(type) {
				case string:
					_ = in
				case types.Object:
					log.Print("Not for now")
				}
			default:
				m.Time = m.Add(24 * time.Hour)
			}
		}
	}()
	return types.Nil{}
}