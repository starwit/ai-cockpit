package db.callbacks;

import org.flywaydb.core.api.callback.Callback;
import org.flywaydb.core.api.callback.Context;
import org.flywaydb.core.api.callback.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FlywayCallback implements Callback {

    static final Logger LOG = LoggerFactory.getLogger(FlywayCallback.class);

    @Override
    public boolean canHandleInTransaction(Event event, Context context) {
        LOG.info("canHandle called");
        return true;
    }

    @Override
    public String getCallbackName() {
        return "sample data importer";
    }

    @Override
    public void handle(Event event, Context context) {
        LOG.info("Importing sample data ..." + event);
        if (event == Event.AFTER_BASELINE) {
            LOG.info("Flyway baseline event");
        }
    }

    @Override
    public boolean supports(Event event, Context context) {
        return event == Event.AFTER_BASELINE;
    }

}
